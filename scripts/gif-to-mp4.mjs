// One-shot repo-shrink tool: converts every animated GIF under public/ to a
// muted H.264 MP4 (~10× smaller at the same clarity), deletes the GIF, then
// rewrites the ![alt](file.gif) references in content/**/*.mdx to .mp4. The
// MDX `img` handler routes .mp4 srcs to the <Video> component, so the reading
// experience is unchanged — clips still autoplay, loop, and stay muted.
//
// Idempotent-ish: skips a GIF whose .mp4 already exists. Safe to re-run.
//
//   node scripts/gif-to-mp4.mjs          # convert + rewrite
//   node scripts/gif-to-mp4.mjs --dry    # report only, touch nothing

import { execFileSync } from 'node:child_process'
import { readdirSync, statSync, existsSync, unlinkSync, readFileSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import ffmpeg from 'ffmpeg-static'

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const PUBLIC = join(ROOT, 'public')
const CONTENT = join(ROOT, 'content')
const DRY = process.argv.includes('--dry')

const MB = (bytes) => (bytes / 1048576).toFixed(2) + 'MB'

function walk(dir, match, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) walk(p, match, out)
    else if (match(entry.name)) out.push(p)
  }
  return out
}

// ── 1. Convert GIFs → MP4 ────────────────────────────────────────────────────
const gifs = walk(PUBLIC, (n) => n.toLowerCase().endsWith('.gif'))
console.log(`Found ${gifs.length} GIF(s) under public/\n`)

let gifBytes = 0
let mp4Bytes = 0
let converted = 0

for (const gif of gifs) {
  const mp4 = gif.replace(/\.gif$/i, '.mp4')
  const before = statSync(gif).size
  gifBytes += before

  if (existsSync(mp4)) {
    console.log(`skip  ${relative(ROOT, gif)} (mp4 exists)`)
    continue
  }
  if (DRY) {
    console.log(`would ${relative(ROOT, gif)} (${MB(before)})`)
    continue
  }

  // yuv420p + even dimensions = broad browser compatibility; faststart puts the
  // moov atom up front so playback can begin before the full file downloads.
  execFileSync(ffmpeg, [
    '-y', '-i', gif,
    '-movflags', '+faststart',
    '-pix_fmt', 'yuv420p',
    '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
    '-c:v', 'libx264', '-crf', '30', '-preset', 'slow',
    '-an', mp4,
  ], { stdio: 'ignore' })

  const after = statSync(mp4).size
  mp4Bytes += after
  converted++
  unlinkSync(gif)
  console.log(`ok    ${relative(ROOT, gif)}  ${MB(before)} → ${MB(after)} (${(100 - (after / before) * 100).toFixed(0)}% smaller)`)
}

// ── 2. Rewrite MDX references .gif → .mp4 ────────────────────────────────────
// Only inside markdown image refs / src attributes, so prose that mentions
// "GIF" as a word is untouched. Matches ](…​.gif) and src="….gif".
const mdxFiles = existsSync(CONTENT) ? walk(CONTENT, (n) => n.toLowerCase().endsWith('.mdx')) : []
let filesTouched = 0
let refsRewritten = 0

for (const file of mdxFiles) {
  const src = readFileSync(file, 'utf8')
  let count = 0
  const next = src
    .replace(/(\]\([^)]*?)\.gif(\s*(?:"[^"]*")?\))/gi, (_m, a, b) => { count++; return `${a}.mp4${b}` })
    .replace(/(src=["'][^"']*?)\.gif(["'])/gi, (_m, a, b) => { count++; return `${a}.mp4${b}` })
  if (count > 0 && next !== src) {
    if (!DRY) writeFileSync(file, next)
    filesTouched++
    refsRewritten += count
    console.log(`mdx   ${relative(ROOT, file)}  (${count} ref${count > 1 ? 's' : ''})`)
  }
}

// ── Summary ──────────────────────────────────────────────────────────────────
console.log(`\n─── ${DRY ? 'DRY RUN — nothing written' : 'Done'} ───`)
console.log(`GIFs converted:   ${converted}/${gifs.length}`)
console.log(`MDX refs rewritten: ${refsRewritten} across ${filesTouched} file(s)`)
if (converted > 0) {
  console.log(`Size:  ${MB(gifBytes)} → ${MB(mp4Bytes)}  (${(100 - (mp4Bytes / gifBytes) * 100).toFixed(0)}% smaller, saved ${MB(gifBytes - mp4Bytes)})`)
}
