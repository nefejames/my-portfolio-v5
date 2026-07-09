// Renders the NEA signature animation (the site's splash/AnimatedLogo) to MP4 +
// GIF for social posts. Reproduces the CSS animation deterministically frame by
// frame — same geometry (lib/logo.data.json) and timing as AnimatedLogo.tsx /
// app/animations.css — so the output matches what plays on the site.
//
//   node scripts/render-logo-video.mjs
//
// Output: marketing/brand-assets/logo-animation.mp4 and .gif
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { execFileSync } from 'node:child_process'
import sharp from 'sharp'
import ffmpegPath from 'ffmpeg-static'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const logo = JSON.parse(readFileSync(join(root, 'lib/logo.data.json'), 'utf8'))
const OUT = join(root, 'marketing/brand-assets')
const FRAMES = join(OUT, '_frames')

// ─── Canvas + brand ───────────────────────────────────────────────────────────
const SIZE = 1080
const BG = '#0F0F12' // matches the splash screen background exactly
const MARK = 460 // on-canvas logo size; centered
const OFF = (SIZE - MARK) / 2
const scale = MARK / logo.viewBox
const CX = logo.viewBox / 2 // tile scales about its own center

// ─── Timing (mirrors AnimatedLogo.tsx / animations.css) ───────────────────────
const TILE_POP = 0.35 // nea-pop duration
const TILE_DELAY = 0.15 // strokes start after the tile mostly lands
const STAGGER = 0.1
const STROKE_DUR = 0.3 // nea-write duration
const drawDone = TILE_DELAY + (logo.strokes.length - 1) * STAGGER + STROKE_DUR // ~1.25s
// Fit an exact 5s of whole loops: each cycle draws (~1.25s), holds, then fades
// back to a blank frame — so the loop point (blank == blank) is seamless.
const DURATION = 5
const LOOPS = 3
const LOOP = DURATION / LOOPS // 1.667s
const HOLD = 0.2 // dwell on the finished signature
const BLANK_TAIL = 0.1 // fully-blank frames at the loop end so it wraps to the
                       // (also blank) first frame with no ghost — truly seamless
const FADE = LOOP - drawDone - HOLD - BLANK_TAIL // ~0.117s fade to blank
const FPS = 30

// ─── Easing ───────────────────────────────────────────────────────────────────
// Cubic-bezier solver (CSS timing functions). x1,y1,x2,y2 with implicit (0,0),(1,1).
function cubicBezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by
  const fx = (t) => ((ax * t + bx) * t + cx) * t
  const fy = (t) => ((ay * t + by) * t + cy) * t
  const dfx = (t) => (3 * ax * t + 2 * bx) * t + cx
  return (x) => {
    let t = x
    for (let i = 0; i < 8; i++) {
      const e = fx(t) - x
      if (Math.abs(e) < 1e-5) break
      const d = dfx(t)
      if (Math.abs(d) < 1e-6) break
      t -= e / d
    }
    return fy(Math.max(0, Math.min(1, t)))
  }
}
const easePop = cubicBezier(0.34, 1.56, 0.64, 1) // nea-bg: overshoot "stamp landing"
const easeOut = cubicBezier(0, 0, 0.58, 1) // nea-stroke: ease-out draw
const clamp01 = (v) => Math.max(0, Math.min(1, v))

// ─── Stroke geometry: real path lengths (so we don't rely on SVG pathLength) ──
function pathLength(d) {
  const nums = d.match(/-?\d+(?:\.\d+)?/g).map(Number)
  let len = 0
  for (let i = 2; i < nums.length; i += 2) {
    len += Math.hypot(nums[i] - nums[i - 2], nums[i + 1] - nums[i - 1])
  }
  return len
}
const lengths = logo.strokes.map(pathLength)

// ─── One frame → SVG string ───────────────────────────────────────────────────
function frameSvg(tLocal) {
  // Group fade-out at the tail of each loop, so the last frame is blank.
  const fadeStart = drawDone + HOLD
  const group = tLocal >= fadeStart ? 1 - clamp01((tLocal - fadeStart) / FADE) : 1
  if (group <= 0) return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}"><rect width="${SIZE}" height="${SIZE}" fill="${BG}"/></svg>`

  // Tile pop (scale + opacity), easing may overshoot past 1.
  const pop = easePop(clamp01(tLocal / TILE_POP))
  const tileScale = 0.6 + 0.4 * pop
  const tileOpacity = clamp01(pop) * group

  const strokes = logo.strokes
    .map((d, i) => {
      const p = clamp01((tLocal - (TILE_DELAY + i * STAGGER)) / STROKE_DUR)
      const drawn = easeOut(p)
      const L = lengths[i]
      return `<path d="${d}" stroke="${logo.strokeColor}" stroke-width="${logo.strokeWidth}" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="${group}" stroke-dasharray="${L}" stroke-dashoffset="${(L * (1 - drawn)).toFixed(3)}"/>`
    })
    .join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}">
  <rect width="${SIZE}" height="${SIZE}" fill="${BG}"/>
  <g transform="translate(${OFF},${OFF}) scale(${scale})">
    <g transform="translate(${CX},${CX}) scale(${tileScale}) translate(${-CX},${-CX})">
      <rect width="${logo.viewBox}" height="${logo.viewBox}" rx="${logo.cornerRadius}" fill="${logo.accent}" opacity="${tileOpacity}"/>
    </g>
    ${strokes}
  </g>
</svg>`
}

// ─── Render frames ────────────────────────────────────────────────────────────
async function main() {
  rmSync(FRAMES, { recursive: true, force: true })
  mkdirSync(FRAMES, { recursive: true })

  const total = Math.round(DURATION * FPS)
  console.log(`Rendering ${total} frames (${DURATION}s @ ${FPS}fps, ${LOOPS} loops of ${LOOP.toFixed(3)}s)…`)
  for (let i = 0; i < total; i++) {
    const tLocal = (i / FPS) % LOOP
    const png = await sharp(Buffer.from(frameSvg(tLocal))).png().toBuffer()
    writeFileSync(join(FRAMES, `f-${String(i).padStart(4, '0')}.png`), png)
  }

  const mp4 = join(OUT, 'logo-animation.mp4')
  const gif = join(OUT, 'logo-animation.gif')
  const palette = join(FRAMES, 'palette.png')
  const run = (args) => execFileSync(ffmpegPath, args, { stdio: ['ignore', 'ignore', 'pipe'] })

  // MP4 — H.264, yuv420p (universally playable), faststart for web streaming.
  console.log('Encoding MP4…')
  run(['-y', '-framerate', String(FPS), '-i', join(FRAMES, 'f-%04d.png'),
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-crf', '18',
    '-movflags', '+faststart', mp4])

  // GIF — 640px @ 20fps (100 frames < 400) with a generated palette for quality.
  console.log('Encoding GIF…')
  const gifVf = 'fps=20,scale=640:640:flags=lanczos'
  run(['-y', '-framerate', String(FPS), '-i', join(FRAMES, 'f-%04d.png'),
    '-vf', `${gifVf},palettegen=stats_mode=full`, palette])
  run(['-y', '-framerate', String(FPS), '-i', join(FRAMES, 'f-%04d.png'), '-i', palette,
    '-lavfi', `${gifVf}[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3`, '-loop', '0', gif])

  rmSync(FRAMES, { recursive: true, force: true })
  const mb = (p) => (statSync(p).size / 1048576).toFixed(2)
  console.log(`\nDone.\n  MP4: ${mp4} (${mb(mp4)} MB)\n  GIF: ${gif} (${mb(gif)} MB)`)
}

main().catch((e) => { console.error(e); process.exit(1) })
