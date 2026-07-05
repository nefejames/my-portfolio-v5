/**
 * LinkedIn carousel generator — "Building my portfolio with Claude Fable 5".
 *
 * Generates 1080×1080 slides in the site's brand tokens (see app/globals.css),
 * writes each as .svg (editable source) and .jpg (rendered via sharp), then
 * assembles carousel.pdf — LinkedIn document posts take a PDF, one page per
 * slide. Re-run after editing the SLIDES copy below:
 *
 *   node marketing/linkedin/claude-fable-5-carousel/build-carousel.js
 *
 * Fonts: Georgia stands in for Fraunces (site serif), Segoe UI for Hanken
 * Grotesk — the closest system fonts available to sharp's SVG rasterizer.
 */
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const OUT = __dirname
const SIZE = 1080

// ─── Brand tokens (mirrors app/globals.css :root) ────────────────────────────
const C = {
  bg: '#0F0F12',
  surface: '#1A1A1F',
  border: '#2A2A30',
  text: '#F4F4F5',
  muted: '#A1A1AA',
  accent: '#4F46E5',
  accentText: '#818CF8',
  accentSubtle: '#1E1B4B',
}
// Single quotes inside — these land in double-quoted SVG attributes.
const SERIF = "Georgia, 'Times New Roman', serif"
const SANS = "'Segoe UI', Arial, sans-serif"

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// ─── NEA mark (same 9-stroke geometry as components/AnimatedLogo.tsx) ────────
function logoMark(x, y, size) {
  const s = size / 80
  const strokes = [
    'M12 10L12 36', 'M12 10L68 36', 'M68 10L68 36',
    'M12 46L12 70', 'M12 46L36 46', 'M12 58L31 58', 'M12 70L36 70',
    'M44 70L56 46L68 70', 'M49 60L63 60',
  ]
  return `<g transform="translate(${x},${y}) scale(${s})">
    <rect width="80" height="80" rx="14" fill="${C.accent}"/>
    ${strokes.map((d) => `<path d="${d}" stroke="white" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`).join('')}
  </g>`
}

// ─── Slide chrome shared by every slide ──────────────────────────────────────
function chrome(num, total) {
  return `
    <rect width="${SIZE}" height="${SIZE}" fill="${C.bg}"/>
    <rect x="0" y="0" width="${SIZE}" height="6" fill="${C.accent}"/>
    ${logoMark(64, 56, 72)}
    <text x="${SIZE - 64}" y="102" text-anchor="end" font-family="${SANS}" font-size="26" fill="${C.muted}">${num} / ${total}</text>
    <line x1="64" y1="${SIZE - 96}" x2="${SIZE - 64}" y2="${SIZE - 96}" stroke="${C.border}" stroke-width="2"/>
    <text x="64" y="${SIZE - 52}" font-family="${SANS}" font-size="24" fill="${C.muted}">Emadamerho-Atori Nefe</text>
    <text x="${SIZE - 64}" y="${SIZE - 52}" text-anchor="end" font-family="${SANS}" font-size="24" fill="${C.accentText}">Content marketer &amp; SEO manager</text>`
}

// Eyebrow label
const eyebrow = (y, label) =>
  `<text x="64" y="${y}" font-family="${SANS}" font-size="26" font-weight="600" letter-spacing="6" fill="${C.accentText}">${esc(label).toUpperCase()}</text>`

// Serif headline, array of lines
const headline = (y, lines, size = 76) =>
  lines.map((l, i) =>
    `<text x="64" y="${y + i * (size * 1.18)}" font-family="${SERIF}" font-size="${size}" font-weight="bold" fill="${C.text}">${esc(l)}</text>`,
  ).join('')

// Bullet card list — stacks cumulatively so multi-line cards never collide.
function bullets(y, items, { cardH = 84, spacing = 22, fontSize = 30, lineGap = 38 } = {}) {
  let cy = y
  const out = []
  for (const item of items) {
    const lines = Array.isArray(item) ? item : [item]
    const h = cardH + (lines.length - 1) * lineGap
    const midY = cy + h / 2
    out.push(`
      <rect x="64" y="${cy}" width="${SIZE - 128}" height="${h}" rx="16" fill="${C.surface}" stroke="${C.border}" stroke-width="2"/>
      <circle cx="112" cy="${midY}" r="7" fill="${C.accentText}"/>
      ${lines.map((l, j) =>
        `<text x="148" y="${midY + 11 + (j - (lines.length - 1) / 2) * lineGap}" font-family="${SANS}" font-size="${fontSize}" fill="${C.text}">${esc(l)}</text>`,
      ).join('')}`)
    cy += h + spacing
  }
  return out.join('')
}

// Plain sans paragraph lines
const para = (y, lines, { size = 32, color = C.muted, lh = 1.5 } = {}) =>
  lines.map((l, i) =>
    `<text x="64" y="${y + i * size * lh}" font-family="${SANS}" font-size="${size}" fill="${color}">${esc(l)}</text>`,
  ).join('')

// ─── Slides ──────────────────────────────────────────────────────────────────
const SLIDES = [
  // 1 — cover
  (n, t) => `${chrome(n, t)}
    ${eyebrow(260, 'Build log · Claude Fable 5')}
    ${headline(360, ['I’m building my', 'entire portfolio', 'site with AI.'], 92)}
    ${para(700, ['75 archived articles. Custom animations. SEO.', 'Performance. One model, one repo.'], { size: 36, color: C.muted })}
    ${logoMark(SIZE - 64 - 200, 640, 200)}
    <rect x="64" y="790" width="470" height="74" rx="14" fill="${C.accentSubtle}"/>
    <text x="94" y="838" font-family="${SANS}" font-size="30" fill="${C.accentText}">Here’s what it actually did →</text>`,

  // 2 — the struggle
  (n, t) => `${chrome(n, t)}
    ${eyebrow(240, 'The backstory')}
    ${headline(330, ['Other models kept', 'letting me down.'], 80)}
    ${bullets(490, [
      ['My name-signature animation? Tried it with', 'Framer Motion before — output was broken.'],
      ['My email + links hardcoded in 7 different places.'],
      ['Duplicated layouts silently drifting apart.'],
      ['Zero thought for performance unless I begged.'],
    ])}`,

  // 3 — the animation win
  (n, t) => `${chrome(n, t)}
    ${eyebrow(240, 'The moment it clicked')}
    ${headline(330, ['The animation I couldn’t', 'get right? One go.'], 72)}
    ${para(482, ['My NEA logo now hand-writes itself — like a signature.'], { size: 34, color: C.text })}
    ${bullets(525, [
      ['9 pen strokes drawing in real writing order'],
      ['Replays when you hover the logo'],
      ['Plays as a 2s splash intro, once per session'],
      ['Respects reduced-motion preferences'],
    ], { cardH: 78, spacing: 20 })}
    ${para(946, ['Previous attempts: broken. Fable 5: perfect, first try.'], { size: 32, color: C.accentText })}`,

  // 4 — content pipeline
  (n, t) => `${chrome(n, t)}
    ${eyebrow(240, 'Not just pages — pipelines')}
    ${headline(330, ['It built me a content', 'archive engine.'], 76)}
    ${para(485, ['75 articles archived: AltexSoft, Prismic, Smashing Magazine.'], { size: 32, color: C.accentText })}
    ${bullets(528, [
      ['Scrapes my published client articles (FireCrawl)'],
      ['Per-client cleanup: strips promos, navs, widgets'],
      ['Rebuilds tables, FAQs + videos from page data'],
      ['Real dates, titles + canonical links to originals'],
    ], { cardH: 80, spacing: 20 })}`,

  // 5 — performance
  (n, t) => `${chrome(n, t)}
    ${eyebrow(240, 'Performance')}
    ${headline(330, ['It optimizes without', 'being asked twice.'], 76)}
    ${bullets(480, [
      ['Found + removed 5 dead dependencies'],
      ['Trimmed server payloads (no over-serialization)'],
      ['Scroll bar re-done: zero re-renders while scrolling'],
      ['Honest image size hints — no more 2x downloads'],
      ['Auto-WebP imports: 1.3MB PNG → 93KB'],
    ], { cardH: 76, spacing: 18 })}`,

  // 6 — cleaning up the mess
  (n, t) => `${chrome(n, t)}
    ${eyebrow(240, 'Code hygiene')}
    ${headline(330, ['It fixed what previous', 'models hardcoded.'], 76)}
    ${bullets(480, [
      ['Email, LinkedIn, name → one SITE config,', 'referenced everywhere'],
      ['Two copy-pasted article layouts → one', 'shared layout for blog + portfolio'],
      ['Scattered animation CSS → one animations.css'],
    ])}
    ${para(930, ['Change my email once, it updates site-wide.'], { size: 32, color: C.accentText })}`,

  // 7 — SEO
  (n, t) => `${chrome(n, t)}
    ${eyebrow(240, 'SEO — my home turf')}
    ${headline(330, ['And it speaks', 'fluent SEO.'], 80)}
    ${bullets(490, [
      ['JSON-LD: Person, Article, Breadcrumbs, ProfilePage'],
      ['Generated OG images for all 75 articles'],
      ['Canonicals pointing to original publications'],
      ['Sitemap, robots, Search Console verification'],
    ])}`,

  // 8 — numbers
  (n, t) => {
    const stat = (x, y, big, label) => `
      <rect x="${x}" y="${y}" width="440" height="240" rx="20" fill="${C.surface}" stroke="${C.border}" stroke-width="2"/>
      <text x="${x + 40}" y="${y + 120}" font-family="${SERIF}" font-size="88" font-weight="bold" fill="${C.accentText}">${big}</text>
      <text x="${x + 40}" y="${y + 180}" font-family="${SANS}" font-size="30" fill="${C.muted}">${esc(label)}</text>`
    return `${chrome(n, t)}
    ${eyebrow(240, 'The scoreboard')}
    ${headline(330, ['Where the build', 'stands today.'], 76)}
    ${stat(64, 455, '75', 'client articles archived')}
    ${stat(576, 455, '249', 'static pages generated')}
    ${stat(64, 715, '93%', 'smaller images on import')}
    ${stat(576, 715, '50', 'commits shipped')}`
  },

  // 9 — CTA
  (n, t) => `${chrome(n, t)}
    ${eyebrow(280, 'Building in public')}
    ${headline(380, ['Follow the build.'], 92)}
    ${para(500, [
      'I’m documenting the whole thing — the wins,',
      'the prompts, and what AI still gets wrong.',
    ], { size: 36, color: C.muted })}
    ${logoMark(64, 660, 160)}
    <text x="260" y="730" font-family="${SERIF}" font-size="44" font-weight="bold" fill="${C.text}">Emadamerho-Atori Nefe</text>
    <text x="260" y="786" font-family="${SANS}" font-size="30" fill="${C.accentText}">Content marketer &amp; SEO manager</text>`,
]

// ─── Minimal PDF assembler (JPEG pages via DCTDecode) ────────────────────────
function jpegsToPdf(jpegs, w, h) {
  const objs = []
  const add = (body) => { objs.push(body); return objs.length } // 1-indexed

  const pageIds = []
  const kidsPlaceholder = add(null) // 1: Pages (patched later)
  const catalogId = add(`<< /Type /Catalog /Pages ${kidsPlaceholder} 0 R >>`)

  for (const buf of jpegs) {
    const imgId = add(
      `<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${buf.length} >>\nstream\n` +
      buf.toString('binary') +
      `\nendstream`,
    )
    const content = `q ${w} 0 0 ${h} 0 0 cm /Im0 Do Q`
    const contentId = add(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`)
    const pageId = add(
      `<< /Type /Page /Parent ${kidsPlaceholder} 0 R /MediaBox [0 0 ${w} ${h}] ` +
      `/Resources << /XObject << /Im0 ${imgId} 0 R >> >> /Contents ${contentId} 0 R >>`,
    )
    pageIds.push(pageId)
  }
  objs[kidsPlaceholder - 1] =
    `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`

  let out = '%PDF-1.4\n'
  const offsets = [0]
  for (let i = 0; i < objs.length; i++) {
    offsets.push(out.length)
    out += `${i + 1} 0 obj\n${objs[i]}\nendobj\n`
  }
  const xref = out.length
  out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`
  for (let i = 1; i <= objs.length; i++) out += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`
  out += `trailer\n<< /Size ${objs.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xref}\n%%EOF`
  return Buffer.from(out, 'binary')
}

// ─── Build ───────────────────────────────────────────────────────────────────
async function main() {
  const total = SLIDES.length
  const jpegs = []
  for (let i = 0; i < total; i++) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">${SLIDES[i](i + 1, total)}</svg>`
    const name = `slide-${String(i + 1).padStart(2, '0')}`
    fs.writeFileSync(path.join(OUT, `${name}.svg`), svg)
    const jpg = await sharp(Buffer.from(svg), { density: 96 }).jpeg({ quality: 92 }).toBuffer()
    fs.writeFileSync(path.join(OUT, `${name}.jpg`), jpg)
    jpegs.push(jpg)
    console.log(`${name}: svg + jpg (${(jpg.length / 1024).toFixed(0)}KB)`)
  }
  fs.writeFileSync(path.join(OUT, 'carousel.pdf'), jpegsToPdf(jpegs, SIZE, SIZE))
  console.log(`carousel.pdf: ${total} pages`)
}

main().catch((e) => { console.error(e); process.exit(1) })
