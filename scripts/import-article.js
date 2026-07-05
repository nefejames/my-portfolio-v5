#!/usr/bin/env node
/**
 * Portfolio article importer (FireCrawl)
 * ─────────────────────────────────────────────────────────────────────────────
 * Imports client articles from external publications into numbered MDX files
 * under content/portfolio/<client>/, downloading their images into
 * public/portfolio/<client>/<article>/ and rewriting the markdown to point at
 * the local copies.
 *
 * Usage:
 *   node scripts/import-article.js --url "https://altexsoft.com/blog/article" --client altexsoft
 *   node scripts/import-article.js --batch urls.txt --client altexsoft
 *   node scripts/import-article.js --crawl "https://prismic.io/blog/author/nefe" --client prismic
 *
 * Reads FIRECRAWL_API_KEY from .env.local. Safe to re-run: if an article with
 * the same slug already exists, you are prompted before it is overwritten.
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')
const { Firecrawl } = require('firecrawl')

const ROOT = path.join(__dirname, '..')
const CONTENT_DIR = path.join(ROOT, 'content', 'portfolio')
const PUBLIC_DIR = path.join(ROOT, 'public', 'portfolio')

// Known clients → display names. Unknown slugs fall back to a capitalized guess.
const CLIENT_NAMES = {
  altexsoft: 'AltexSoft',
  prismic: 'Prismic',
  logrocket: 'LogRocket',
  dojah: 'Dojah',
  'smashing-magazine': 'Smashing Magazine',
}

// ─── .env.local loader (no extra dependency) ──────────────────────────────────
function loadEnvLocal() {
  const envPath = path.join(ROOT, '.env.local')
  if (!fs.existsSync(envPath)) return
  const raw = fs.readFileSync(envPath, 'utf8')
  for (const line of raw.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i)
    if (!m) continue
    const key = m[1]
    let val = m[2].trim().replace(/^["']|["']$/g, '')
    if (!(key in process.env)) process.env[key] = val
  }
}

// ─── CLI parsing ──────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const args = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith('--')) {
      const key = a.slice(2)
      const next = argv[i + 1]
      if (next && !next.startsWith('--')) {
        args[key] = next
        i++
      } else {
        args[key] = true
      }
    }
  }
  return args
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[`*_[\]()#]/g, '')
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .trim()
}

// The article's URL slug is the last path segment of its original URL, so the
// portfolio route mirrors the source (e.g. .../blog/websockets/ → "websockets").
function slugFromUrl(u) {
  try {
    const pathname = new URL(u).pathname.replace(/\/+$/, '')
    return (pathname.split('/').filter(Boolean).pop() || '').toLowerCase()
  } catch {
    return ''
  }
}

function clientDisplayName(slug) {
  if (CLIENT_NAMES[slug]) return CLIENT_NAMES[slug]
  return slug.charAt(0).toUpperCase() + slug.slice(1)
}

function toIsoDate(value) {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString().slice(0, 10)
}

function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer.trim().toLowerCase())
    }),
  )
}

/** Next zero-padded number for a client folder (max existing + 1). */
function nextNumber(clientSlug) {
  const dir = path.join(CONTENT_DIR, clientSlug)
  if (!fs.existsSync(dir)) return '001'
  let max = 0
  for (const f of fs.readdirSync(dir)) {
    const m = f.match(/^(\d+)-.*\.mdx$/)
    if (m) max = Math.max(max, parseInt(m[1], 10))
  }
  return String(max + 1).padStart(3, '0')
}

/** Find an existing MDX file in the client folder whose slug matches. */
function findExistingBySlug(clientSlug, slug) {
  const dir = path.join(CONTENT_DIR, clientSlug)
  if (!fs.existsSync(dir)) return null
  for (const f of fs.readdirSync(dir)) {
    const m = f.match(/^\d+-(.*)\.mdx$/)
    if (m && m[1] === slug) return f
  }
  return null
}

function extImageFromUrl(url, contentType) {
  try {
    const pathname = new URL(url).pathname
    const ext = path.extname(pathname).toLowerCase()
    if (/^\.(jpe?g|png|gif|webp|avif|svg)$/.test(ext)) return ext
  } catch {
    /* ignore */
  }
  if (contentType) {
    if (contentType.includes('png')) return '.png'
    if (contentType.includes('webp')) return '.webp'
    if (contentType.includes('gif')) return '.gif'
    if (contentType.includes('svg')) return '.svg'
    if (contentType.includes('avif')) return '.avif'
    if (contentType.includes('jpeg') || contentType.includes('jpg')) return '.jpg'
  }
  return '.jpg'
}

/** Extract markdown image URLs (remote http/https only), de-duplicated. */
function extractImageUrls(markdown) {
  const urls = new Set()
  const re = /!\[[^\]]*\]\((https?:\/\/[^)\s]+)(?:\s+"[^"]*")?\)/g
  let m
  while ((m = re.exec(markdown)) !== null) urls.add(m[1])
  return Array.from(urls)
}

// ─── Rich embeds ──────────────────────────────────────────────────────────────
// Scraped markdown represents tweets / YouTube videos / LinkedIn posts as plain
// links. The shared MDX renderer ships <Tweet>, <YouTube>, and <LinkedIn>
// components (components/blog/MdxComponents.tsx), so we rewrite standalone embed
// links into those component tags to get the same rich rendering as the blog.

function youTubeId(url) {
  const patterns = [
    /(?:youtube\.com|youtube-nocookie\.com)\/(?:watch\?(?:[^&\s]*&)*v=|embed\/|shorts\/|v\/|live\/)([A-Za-z0-9_-]{11})/i,
    /youtu\.be\/([A-Za-z0-9_-]{11})/i,
  ]
  for (const re of patterns) {
    const m = url.match(re)
    if (m) return m[1]
  }
  return null
}

function tweetId(url) {
  const m = url.match(/(?:twitter\.com|x\.com)\/[^/]+\/status(?:es)?\/(\d+)/i)
  return m ? m[1] : null
}

function linkedInEmbedUrl(url) {
  return /linkedin\.com\/(?:posts|embed|feed\/update)\//i.test(url) ? url : null
}

/** Map a single URL to its component tag, or null if it isn't a known embed. */
function embedTagForUrl(url) {
  const yt = youTubeId(url)
  if (yt) return `<YouTube id="${yt}" />`
  const tw = tweetId(url)
  if (tw) return `<Tweet id="${tw}" />`
  const li = linkedInEmbedUrl(url)
  if (li) return `<LinkedIn url="${li}" />`
  return null
}

/** Extract the primary URL of a line that is *only* a link (bare, autolink, or
 *  markdown link — including a thumbnail like [![](thumb)](url)). Returns null
 *  for prose lines so inline reference links are never touched. */
function standaloneUrl(line) {
  const t = line.trim()
  let m
  if ((m = t.match(/^<(https?:\/\/[^>]+)>$/))) return m[1]
  if ((m = t.match(/^(https?:\/\/\S+)$/))) return m[1].replace(/[.,;]+$/, '')
  // Trailing ](url) catches both [text](url) and [![alt](thumb)](url).
  if ((m = t.match(/\]\((https?:\/\/[^)\s]+)(?:\s+"[^"]*")?\)$/))) return m[1]
  return null
}

/** Replace standalone embed links with their component tags. Runs before image
 *  download so embed thumbnails aren't downloaded as article images. */
function convertEmbeds(markdown) {
  let count = 0
  const lines = markdown.split('\n').map((line) => {
    const url = standaloneUrl(line)
    if (!url) return line
    const tag = embedTagForUrl(url)
    if (!tag) return line
    count++
    // Blank-line padding keeps the tag a valid MDX flow element.
    return `\n${tag}\n`
  })
  return { content: lines.join('\n'), count }
}

// Re-encode PNG/JPEG buffers as WebP (typically 60-70% smaller) so imports
// stop accumulating multi-MB originals in the repo. GIFs (animation), SVGs
// (vectors), and existing WebP/AVIF pass through untouched. On any encode
// failure, fall back to the original bytes.
async function webpIfRaster(buf, ext) {
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') return { buf, ext }
  try {
    const sharp = require('sharp')
    return { buf: await sharp(buf).webp({ quality: 82 }).toBuffer(), ext: '.webp' }
  } catch (err) {
    console.warn(`  ⚠ WebP conversion failed: ${err.message} — saving original`)
    return { buf, ext }
  }
}

async function downloadImage(url, destDir, index, contentTypeHint) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const contentType = res.headers.get('content-type') || contentTypeHint
  const raw = Buffer.from(await res.arrayBuffer())
  const { buf, ext } = await webpIfRaster(raw, extImageFromUrl(url, contentType))
  const fileName = `image-${index}${ext}`
  fs.mkdirSync(destDir, { recursive: true })
  fs.writeFileSync(path.join(destDir, fileName), buf)
  return fileName
}

// ─── schema.org video extraction ─────────────────────────────────────────────
// Sites like AltexSoft lazy-load YouTube as a thumbnail + play-button image, so
// the scraped markdown has no youtube.com URL to convert — but the page's
// schema.org JSON-LD carries the real embed URL. Parse it to recover
// { name, youtubeId } pairs; altexsoftCleanup matches them back to the
// thumbnails (by video name) and swaps in <YouTube> tags.
function collectVideoObjects(node, acc) {
  if (!node || typeof node !== 'object') return
  if (Array.isArray(node)) {
    for (const item of node) collectVideoObjects(item, acc)
    return
  }
  const type = node['@type']
  const isVideo =
    type === 'VideoObject' || (Array.isArray(type) && type.includes('VideoObject'))
  if (isVideo) {
    const url = node.embedUrl || node.contentUrl || node.url || ''
    const id = youTubeId(typeof url === 'string' ? url : '')
    if (id) acc.push({ name: String(node.name || '').trim(), youtubeId: id })
  }
  // Recurse into nested containers (@graph, video, hasPart, …) and any values.
  for (const key of Object.keys(node)) {
    if (key === '@type' || key === 'name') continue
    collectVideoObjects(node[key], acc)
  }
}

function extractSchemaVideos(html) {
  if (!html) return []
  const videos = []
  const scriptRe = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  let m
  while ((m = scriptRe.exec(html)) !== null) {
    try {
      collectVideoObjects(JSON.parse(m[1].trim()), videos)
    } catch {
      /* skip malformed JSON-LD blocks */
    }
  }
  const seen = new Set()
  return videos.filter((v) => v.youtubeId && !seen.has(v.youtubeId) && seen.add(v.youtubeId))
}

// ─── schema.org publish date ──────────────────────────────────────────────────
// Some publishers (e.g. AltexSoft) don't expose the publish date via standard
// <meta> tags, so FireCrawl's metadata.publishedTime comes back empty and the
// import would otherwise default to today. The date IS in the page's schema.org
// Article/BlogPosting JSON-LD — pull datePublished from there.
const ARTICLE_TYPES = ['Article', 'BlogPosting', 'NewsArticle', 'TechArticle', 'ScholarlyArticle', 'Report']

// Collect a given property's values from every Article-type node in a JSON-LD tree.
function collectArticleField(node, field, acc) {
  if (!node || typeof node !== 'object') return
  if (Array.isArray(node)) {
    for (const item of node) collectArticleField(item, field, acc)
    return
  }
  const type = node['@type']
  const isArticle =
    (typeof type === 'string' && ARTICLE_TYPES.includes(type)) ||
    (Array.isArray(type) && type.some((t) => ARTICLE_TYPES.includes(t)))
  if (isArticle && node[field]) acc.push(node[field])
  for (const key of Object.keys(node)) {
    if (key === '@type') continue
    collectArticleField(node[key], field, acc)
  }
}

function collectSchemaField(html, field) {
  const out = []
  if (!html) return out
  const scriptRe = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  let m
  while ((m = scriptRe.exec(html)) !== null) {
    try {
      collectArticleField(JSON.parse(m[1].trim()), field, out)
    } catch {
      /* skip malformed JSON-LD blocks */
    }
  }
  return out
}

/** Article publish date (YYYY-MM-DD) from schema.org JSON-LD, or null. */
function extractSchemaDate(html) {
  const dates = collectSchemaField(html, 'datePublished')
  return dates.length ? toIsoDate(dates[0]) : null
}

/** Full article title from schema.org headline — avoids the truncated SEO
 *  <title>/og:title some publishers (AltexSoft) serve. Null if none. */
function extractSchemaHeadline(html) {
  const heads = collectSchemaField(html, 'headline')
  return heads.length ? String(heads[0]).trim() : null
}

// ─── AltexSoft cleanup ────────────────────────────────────────────────────────
// AltexSoft's pages wrap the article body in template chrome that FireCrawl's
// onlyMainContent doesn't fully strip. This removes that chrome so an AltexSoft
// import comes out clean automatically. It runs ONLY for `--client altexsoft`
// (see importDocument). Each step is isolated and commented so steps can be
// added or removed easily as their template changes.
function altexsoftCleanup(markdown, videos = []) {
  let lines = markdown.split('\n')

  // Step 1 — Drop leading chrome (featured image, duplicate H1, author headshot,
  // byline, "X min read / category / Published / No comments" bullets) by cutting
  // everything up to and including the "Share" bar that precedes the body.
  const shareIdx = lines.findIndex((l) => l.trim() === 'Share')
  if (shareIdx !== -1) lines = lines.slice(shareIdx + 1)

  // Step 2 — Drop trailing chrome (author bio, "become a contributor" CTA, and
  // the "Good and the Bad" series footer). Cut from the earliest trailing marker:
  // the author-bio image (alt contains "bio"), or either footer phrase.
  const trailingMarkers = [
    (l) => /!\[[^\]]*bio[^\]]*\]\(/i.test(l), // author bio image
    (l) => /become a contributor/i.test(l),
    (l) => /This post is a part of/i.test(l),
  ]
  let cutAt = -1
  lines.forEach((l, i) => {
    if (cutAt === -1 && trailingMarkers.some((test) => test(l))) cutAt = i
  })
  if (cutAt !== -1) lines = lines.slice(0, cutAt)

  // Step 3 — Remove every "Related Articles" widget. AltexSoft injects these
  // mid-article, sometimes several times, interleaved with real content. Each is
  // the heading followed by a run of "card" lines: linked "### [Title](url)"
  // subheadings, "N min read" lines, thumbnails, and category-link lines. We
  // consume ONLY those card lines and stop at the next real heading/paragraph,
  // so real content between widgets is preserved (the old "until next ##" rule
  // both ate real content and missed later blocks).
  const isRelatedCardLine = (l) => {
    const t = l.trim()
    return (
      t === '' ||
      /^###\s+\[.*\]\(.*\)\s*$/.test(t) || // linked card heading
      /^\d+\s*min read/i.test(t) || // read-time line
      /^\[!\[/.test(t) || // [![thumb](img)…](url) image-link
      /^!\[[^\]]*\]\([^)]*\)\s*$/.test(t) || // bare thumbnail image
      /^(\[[^\]]*\]\([^)]*\)[\s,]*)+$/.test(t) // line of only links (categories)
    )
  }
  for (let i = 0; i < lines.length; i++) {
    if (!/^##\s+Related Articles/i.test(lines[i])) continue
    let j = i + 1
    while (j < lines.length && isRelatedCardLine(lines[j])) j++
    lines.splice(i, j - i)
    i-- // re-check this index after removal
  }

  // Step 4 — Remove the redundant "See Also" link box: the heading plus the
  // bullet-list/blank lines that immediately follow it.
  const seeAlso = lines.findIndex((l) => /^###\s+See Also/i.test(l))
  if (seeAlso !== -1) {
    let end = seeAlso + 1
    while (end < lines.length && (lines[end].trim() === '' || lines[end].trimStart().startsWith('- ['))) {
      end++
    }
    lines.splice(seeAlso, end - seeAlso)
  }

  // Steps 5 & 6 — Remove embedded-video widgets and duplicate plain-text captions
  // in one pass. AltexSoft repeats each image's caption as a standalone paragraph
  // right after the image; the alt already renders as the <figcaption>, so the
  // bare-text copy is dropped. Video widgets (a thumbnail followed by a
  // "PlayButton" SVG on one line) are removed too — and since they also carry a
  // duplicate caption, we track the thumbnail's alt so that caption is dropped.
  const trailingImageAltRe = /!\[([^\]]+)\]\([^)]*\)\s*$/ // image at end of line
  const firstImageAltRe = /!\[([^\]]*)\]\([^)]*\)/ // first image on a line
  const out = []
  let pendingAlt = null
  for (const line of lines) {
    if (/!\[PlayButton\]/i.test(line)) {
      // Video widget. The first image's alt is the video title — match it to a
      // schema.org video and swap in a <YouTube> tag; otherwise just drop it.
      const alt = (line.match(firstImageAltRe) || [, ''])[1].trim()
      const video = videos.find(
        (v) => v.name && v.name.toLowerCase() === alt.toLowerCase(),
      )
      if (video) {
        // Use the video title as a caption (escape quotes for the JSX attribute).
        const caption = (video.name || alt).replace(/"/g, '&quot;')
        out.push(
          caption
            ? `<YouTube id="${video.youtubeId}" caption="${caption}" />`
            : `<YouTube id="${video.youtubeId}" />`,
        )
      }
      // Remember the alt so the duplicate caption line that follows is dropped.
      pendingAlt = alt || null
      continue
    }
    const m = line.match(trailingImageAltRe)
    if (m) {
      pendingAlt = m[1].trim()
      out.push(line)
      continue
    }
    if (line.trim() === '') {
      out.push(line)
      continue // keep blank lines between an image and its caption
    }
    if (pendingAlt && line.trim() === pendingAlt) {
      pendingAlt = null
      continue // drop the duplicate caption line
    }
    pendingAlt = null
    out.push(line)
  }
  lines = out

  // Step 7 — Collapse 3+ blank lines to a single blank line and trim.
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

// ─── MDX safety ───────────────────────────────────────────────────────────────
// Scraped prose can contain characters MDX parses as code: a stray "<" becomes a
// JSX tag, "{ }" become expressions — either breaks compilation. Escape them to
// HTML entities (which render identically) in prose only, leaving fenced code
// blocks, inline code, and our own component tags untouched.
function sanitizeMdx(markdown) {
  const escape = (s) =>
    s.replace(/[<{}]/g, (c) => ({ '<': '&lt;', '{': '&#123;', '}': '&#125;' }[c]))
  const isComponentLine = (l) => /^<\/?(YouTube|Tweet|LinkedIn|CodePen)\b/.test(l.trim())

  let inFence = false
  return markdown
    .split('\n')
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        inFence = !inFence
        return line // fence delimiters and code stay verbatim
      }
      if (inFence || isComponentLine(line)) return line
      // Escape everything except inline-code spans (`...`).
      return line
        .split(/(`[^`]*`)/)
        .map((seg) => (seg.startsWith('`') && seg.endsWith('`') ? seg : escape(seg)))
        .join('')
    })
    .join('\n')
}

// ─── Smashing Magazine cleanup ────────────────────────────────────────────────
// Smashing wraps the article in template chrome: a top block (skip links,
// read-time, category, share, author bio, newsletter signup, promo ads) and a
// footer ("Further Reading" to other Smashing posts, editorial credit,
// newsletter/workshop/books promos). Strip both while preserving the author's
// own content (including any "Resources" section, which sits above the footer).
// Runs ONLY for `--client smashing-magazine`.
function smashingCleanup(markdown) {
  let lines = markdown.split('\n')

  // Leading chrome: cut from the top through the newsletter + promo-ads block.
  // The real article starts at the first prose paragraph after it.
  const nl = lines.findIndex((l) => /^####\s+Email Newsletter/i.test(l))
  if (nl !== -1) {
    let i = nl + 1
    const isLeadChrome = (l) => {
      const t = l.trim()
      return (
        t === '' ||
        t.startsWith('-') || // promo list items
        t.startsWith('[') ||
        t.startsWith('![') ||
        t.startsWith('#') ||
        t.startsWith('_') ||
        /trusted by|your \(smashing\) email|weekly tips/i.test(t)
      )
    }
    while (i < lines.length && isLeadChrome(lines[i])) i++
    lines = lines.slice(i)
  }

  // Trailing chrome: cut from the earliest footer marker to the end.
  const footerMarkers = [
    (l) => /^###\s+Further Reading/i.test(l),
    (l) => /!\[Smashing Editorial\]/i.test(l),
    (l) => /!\[Smashing Newsletter\]/i.test(l),
  ]
  let cut = -1
  lines.forEach((l, i) => {
    if (cut === -1 && footerMarkers.some((m) => m(l))) cut = i
  })
  if (cut !== -1) lines = lines.slice(0, cut)

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

// ─── Prismic cleanup ──────────────────────────────────────────────────────────
// Prismic wraps the article in site chrome: a header (webinar banner, category
// nav, "Search", sometimes a series table-of-contents), a mid-article newsletter
// signup, and a footer (a related-articles block, "Hit your website goals", the
// "Websites success stories from the Prismic Community" case studies, and the
// "Prismic Toolbar iFrame"). Strip all of it. Runs ONLY for `--client prismic`.
// ─── Prismic slice data ───────────────────────────────────────────────────────
// prismic.io is a Next.js App Router app; each article's Prismic document (its
// "slices") is embedded in the page's React flight data. Recovering it gives us
// ground truth the scraped markdown flattens away: comparison-table rows, every
// FAQ answer (the accordion renders only the open one), video embeds, and each
// code snippet's language.

const PRISMIC_ARTICLE_SLICE_TYPES = new Set([
  'text_content', 'code_snippet', 'video', 'faq', 'comparison_table',
  'image', 'quote', 'embed', 'blog_call_to_action', 'heading',
])

function extractPrismicSlices(html) {
  if (!html) return []
  // Concatenate the flight-stream chunks. Each push payload is a JSON string
  // literal, so JSON.parse recovers one escaping level.
  let stream = ''
  const pushRe = /self\.__next_f\.push\(\[1,("(?:[^"\\]|\\.)*")\]\)/g
  let m
  while ((m = pushRe.exec(html))) {
    try { stream += JSON.parse(m[1]) } catch { /* skip malformed chunk */ }
  }
  // The document may sit one more string level deep; try both depths and keep
  // the "slices" array that contains the most article slice types (the page
  // also embeds nav/footer documents with their own slices arrays).
  const candidates = [stream, stream.replace(/\\"/g, '"').replace(/\\\\/g, '\\')]
  let best = null
  for (const text of candidates) {
    let idx = text.indexOf('"slices":[{')
    while (idx !== -1) {
      const start = idx + '"slices":'.length
      let depth = 0
      let end = -1
      for (let i = start; i < text.length; i++) {
        const c = text[i]
        if (c === '"') {
          i++
          while (i < text.length && text[i] !== '"') { if (text[i] === '\\') i++; i++ }
        } else if (c === '[' || c === '{') depth++
        else if (c === ']' || c === '}') { depth--; if (depth === 0) { end = i + 1; break } }
      }
      if (end !== -1) {
        try {
          const arr = JSON.parse(text.slice(start, end))
          if (Array.isArray(arr)) {
            const n = arr.filter((s) => s && PRISMIC_ARTICLE_SLICE_TYPES.has(s.slice_type)).length
            if (n > 0 && (!best || n > best.n)) best = { arr, n }
          }
        } catch { /* not the document we want */ }
      }
      idx = text.indexOf('"slices":[{', idx + 1)
    }
    if (best) break // prefer the shallower escape depth once it yields slices
  }
  return best ? best.arr : []
}

/** Prismic rich text (blocks with spans) → markdown. `inline: true` joins
 *  blocks with spaces for table cells; otherwise blocks become paragraphs. */
function richTextToMarkdown(blocks, { inline = false } = {}) {
  const renderBlock = (b) => {
    let text = b.text || ''
    // Apply spans back-to-front so earlier offsets stay valid.
    const spans = (b.spans || []).slice().sort((a, z) => z.start - a.start)
    for (const s of spans) {
      const seg = text.slice(s.start, s.end)
      let wrapped = seg
      if (s.type === 'hyperlink' && s.data && s.data.url) wrapped = `[${seg}](${s.data.url})`
      else if (s.type === 'strong') wrapped = `**${seg}**`
      else if (s.type === 'em') wrapped = `*${seg}*`
      text = text.slice(0, s.start) + wrapped + text.slice(s.end)
    }
    if (b.type === 'list-item') return `- ${text}`
    if (b.type === 'o-list-item') return `1. ${text}`
    if (b.type === 'preformatted') return '```\n' + (b.text || '') + '\n```'
    return text
  }
  const parts = (blocks || []).map(renderBlock).filter((t) => t.trim() !== '')
  return inline ? parts.join(' ').replace(/\s+/g, ' ').trim() : parts.join('\n\n')
}

/** Normalize a markdown line for matching against slice text. */
function normForMatch(t) {
  return t.replace(/[*\\`]/g, '').replace(/\s+/g, ' ').trim()
}

function prismicCleanup(markdown, slices = []) {
  let lines = markdown.split('\n')

  // 0. CodePen embeds — the scrape renders each pen as a widget dump:
  //    "CodePen Embed - {title}", fake editor code fences, account chrome
  //    ("This Pen is owned by…", External CSS/JS), a loading message, and
  //    finally "[Open on CodePen](https://codepen.io/{user}/pen/{id})".
  //    Collapse the whole block into a <CodePen /> component tag. Runs first
  //    so the junk (which contains code fences) can't confuse later passes.
  {
    // Tolerates the occasional mangled target the scraper produces, e.g.
    // "https://prismic.io/blog/=https://codepen.io/user/pen/id".
    const penUrl = (l) => {
      const m = l.match(/^\[Open on CodePen\]\(([^)]*)\)/)
      // /details/ and /full/ appear when Prismic couldn't auto-embed a pen.
      return m && m[1].match(/codepen\.io\/([^/)?]+)\/(?:pen|details|full)\/([A-Za-z0-9]+)/)
    }
    const penTag = (user, id, rawTitle) => {
      // Titles arrive as "1\. Explosive letter burst" — drop the list
      // numbering; escape quotes for the JSX attribute.
      const title = (rawTitle || '').replace(/^\d+\\?\.\s*/, '').replace(/"/g, '&quot;').trim()
      return `<CodePen user="${user}" id="${id}"${title ? ` title="${title}"` : ''} />`
    }

    // 0a. Fully-hydrated widget dump: "CodePen Embed - {title}", fake editor
    //     fences (which can include the pen's entire source, hundreds of
    //     lines), account chrome, then the Open-on-CodePen link. Everything
    //     between marker and link is widget junk; dumps never nest, so the
    //     first link found belongs to this marker. Also stops at an existing
    //     <CodePen> tag (re-cleaning a file where 0b already tagged the tail).
    let out = []
    for (let i = 0; i < lines.length; i++) {
      const start = lines[i].match(/^CodePen Embed - (.*)$/)
      if (start) {
        let j = i + 1
        let pen = null
        let tagLine = null
        for (; j < lines.length && j - i < 900; j++) {
          if (/^<CodePen /.test(lines[j])) { tagLine = lines[j]; break }
          pen = penUrl(lines[j])
          if (pen) break
        }
        if (pen || tagLine) {
          out.push(tagLine || penTag(pen[1], pen[2], start[1]))
          i = j // resume after the link / existing tag
          continue
        }
      }
      out.push(lines[i])
    }
    lines = out

    // 0b. Compact form (pen never hydrated at scrape time): a bare title line,
    //     "Loading interactive CodePen...", then the Open-on-CodePen link.
    //     Walk back from the link absorbing the loading line and the label.
    out = []
    for (const line of lines) {
      const pen = penUrl(line)
      if (pen) {
        // Pop trailing blanks + the loading / embed-failure message.
        while (out.length && out[out.length - 1].trim() === '') out.pop()
        if (
          out.length &&
          /^(Loading interactive CodePen|This CodePen URL could not be embedded)/.test(
            out[out.length - 1].trim(),
          )
        ) {
          out.pop()
          while (out.length && out[out.length - 1].trim() === '') out.pop()
        }
        // The widget label: a short plain line (not a heading/list/image/link).
        let title = ''
        const prev = out.length ? out[out.length - 1].trim() : ''
        if (prev && prev.length < 80 && !/^[#\-*>!\[<|]|^\d+\\?\./.test(prev)) {
          title = prev
          out.pop()
        }
        out.push('', penTag(pen[1], pen[2], title), '')
        continue
      }
      out.push(line)
    }
    lines = out
  }

  // 1. Leading header — cut through "Search", then skip a series table-of-contents
  //    (a run of standalone link-only lines) before the real intro.
  const searchIdx = lines.findIndex((l, i) => i < 40 && l.trim() === 'Search')
  if (searchIdx !== -1) lines = lines.slice(searchIdx + 1)
  const linkOnly = (t) => t === '' || /^(\[[^\]]*\]\([^)]*\)[\s.,]*)+$/.test(t)
  let s = 0
  while (s < lines.length && linkOnly(lines[s].trim())) s++
  lines = lines.slice(s)

  // 2. Trailing footer — cut from the earliest footer marker to the end. Covers
  //    the "Hit your website goals" CTA, the "Websites success stories" case
  //    studies, the "Prismic Toolbar iFrame", and the "PreviousNext" pager.
  const footer = [
    /^Hit your website goals/i,
    /^##\s+Websites success stories/i,
    /Prismic Toolbar iFrame/i,
    /^PreviousNext$/,
  ]
  const cut = lines.findIndex((l) => footer.some((re) => re.test(l.trim())))
  if (cut !== -1) lines = lines.slice(0, cut)

  // 3. Newsletter widget(s) — remove every block around a standalone "Subscribe".
  for (let guard = 0; guard < 6; guard++) {
    const subIdx = lines.findIndex((l) => l.trim() === 'Subscribe')
    if (subIdx === -1) break
    let start = subIdx
    for (let i = subIdx - 1; i >= 0 && subIdx - i <= 10; i--) {
      if (
        /^#{2,4}\s/.test(lines[i]) ||
        /stay on top|newsletter|subscribe to get|optimized dev|join other developers/i.test(lines[i])
      ) {
        start = i
      }
    }
    let end = subIdx + 1
    while (
      end < lines.length &&
      (lines[end].trim() === '' || /^!?\[/.test(lines[end].trim()) || /^Email/i.test(lines[end].trim()))
    )
      end++
    lines.splice(start, end - start)
  }

  // 4. Related-article widgets — Prismic injects "recommended reading" boxes: a
  //    heading label, a decorative (empty-alt) image, then [Category]/[**Title**]
  //    card pairs. A real heading is followed by prose; a widget heading is
  //    followed immediately by that decorative image or a /blog/category/ link.
  //    Remove the heading and the whole card run up to the next real heading/prose.
  const isWidgetLine = (t) =>
    t === '' ||
    /^!\[[^\]]*\]\(/.test(t) ||
    /\/blog\/category\//.test(t) ||
    /^\[.*\]\(https?:[^)]*\)\s*$/.test(t) ||
    /min read/i.test(t)
  const introducesWidget = (i) => {
    let j = i + 1
    while (j < lines.length && lines[j].trim() === '') j++
    if (j >= lines.length) return false
    const t = lines[j].trim()
    return /^!\[\]\(/.test(t) || /\/blog\/category\//.test(t)
  }
  const out = []
  let k = 0
  while (k < lines.length) {
    const t = lines[k].trim()
    if (/^#{2,4}\s/.test(lines[k]) && introducesWidget(k)) {
      k++ // drop the widget's heading label
      while (k < lines.length && !/^#{2,4}\s/.test(lines[k]) && isWidgetLine(lines[k].trim())) k++
      continue
    }
    // A stray card run with no heading: a decorative image that leads into a
    // category tag + link. Drop the contiguous widget block.
    if (/^!\[\]\(/.test(t) && introducesWidget(k)) {
      while (k < lines.length && !/^#{2,4}\s/.test(lines[k]) && isWidgetLine(lines[k].trim())) k++
      continue
    }
    // A stray category tag + its following standalone link.
    if (/\/blog\/category\//.test(t)) {
      k++
      if (k < lines.length && lines[k].trim() === '') k++
      if (k < lines.length && /^\[.*\]\(https?:[^)]*\)\s*$/.test(lines[k].trim())) k++
      continue
    }
    out.push(lines[k])
    k++
  }
  lines = out

  // 4b. CTA slices — Prismic interleaves "blog_call_to_action" promos (product
  //     pitch + illustration + signup link) into articles. Match each slice's
  //     title heading in the markdown and cut the section up to the next heading.
  for (const slice of slices) {
    if (slice.slice_type !== 'blog_call_to_action') continue
    const title = ((slice.primary && slice.primary.title && slice.primary.title[0] && slice.primary.title[0].text) || '').trim()
    if (!title) continue
    const idx = lines.findIndex((l) => {
      const hm = l.match(/^#{2,4}\s+(.*)$/)
      return hm && normForMatch(hm[1]) === normForMatch(title)
    })
    if (idx === -1) continue
    let end = idx + 1
    while (end < lines.length && !/^#{1,6}\s/.test(lines[end])) end++
    lines.splice(idx, end - idx)
  }

  // 4c. Comparison tables — the rendered table is a div grid, so the scrape
  //     flattens it to one line per cell. Rebuild a GFM table from the slice
  //     and replace the flattened run (header names through the last cell text).
  for (const slice of slices) {
    if (slice.slice_type !== 'comparison_table' || !slice.items || !slice.items.length) continue
    const p = slice.primary || {}
    const cats = [p.category_one, p.category_two, p.category_three].filter(Boolean)
    if (!cats.length) continue
    const cellText = (item, i) => {
      const text = richTextToMarkdown(item[`text_category_${i}`] || [], { inline: true })
      if (text) return text.replace(/\|/g, '\\|')
      const val = item[['value_one', 'value_two', 'value_three'][i - 1]]
      return val === true ? '✓' : '—'
    }
    const header = ['', ...cats]
    const tableLines = [
      `| ${header.join(' | ')} |`,
      `| ${header.map(() => '---').join(' | ')} |`,
      ...slice.items.map((it) => {
        const label = (it.sub_heading || '').replace(/\|/g, '\\|')
        return `| ${[label, ...cats.map((_, i) => cellText(it, i + 1))].join(' | ')} |`
      }),
    ]
    // Locate the flattened run: category_one's line directly followed (over
    // blanks) by category_two's, then each row's texts in order.
    const start = lines.findIndex((l, i) => {
      if (normForMatch(l) !== normForMatch(cats[0])) return false
      let j = i + 1
      while (j < lines.length && lines[j].trim() === '') j++
      return j < lines.length && normForMatch(lines[j]) === normForMatch(cats[1] || '')
    })
    if (start === -1) continue
    const expected = []
    for (const it of slice.items) {
      if (it.sub_heading) expected.push(it.sub_heading)
      cats.forEach((_, i) => {
        for (const b of it[`text_category_${i + 1}`] || []) {
          if (b.text && b.text.trim()) expected.push(b.text)
        }
      })
    }
    let cursor = start + 1
    let last = start + 1 // at least consume the two header lines
    for (const exp of expected) {
      for (let j = cursor; j < Math.min(lines.length, cursor + 10); j++) {
        if (lines[j].trim() !== '' && normForMatch(lines[j]) === normForMatch(exp)) {
          last = j
          cursor = j + 1
          break
        }
      }
    }
    lines.splice(start, last - start + 1, '', ...tableLines, '')
  }

  // 4d. FAQs — the rendered accordion exposes only the open answer, so the
  //     scrape drops the rest. Rebuild the whole section from the faq slice.
  const faqSlice = slices.find((s) => s.slice_type === 'faq' && s.items && s.items.length)
  if (faqSlice) {
    let start = lines.findIndex((l) => /^#{2,3}\s+.*\b(FAQs?|Frequently asked questions)\b/i.test(l))
    if (start === -1) {
      const firstQ = ((faqSlice.items[0].question || [])[0] || {}).text || ''
      if (firstQ.trim()) {
        start = lines.findIndex(
          (l) => /^#{2,4}\s/.test(l) && normForMatch(l.replace(/^#+\s*/, '')).includes(normForMatch(firstQ)),
        )
      }
    }
    if (start !== -1) {
      const lvl = lines[start].match(/^(#{1,6})\s/)[1].length
      let end = start + 1
      while (end < lines.length) {
        const hm = lines[end].match(/^(#{1,6})\s/)
        if (hm && hm[1].length <= lvl) break
        end++
      }
      const qLevel = '#'.repeat(Math.min(lvl + 1, 6))
      const rebuilt = [lines[start], '']
      for (const item of faqSlice.items) {
        const q = (item.question || []).map((b) => b.text || '').join(' ').trim()
        const a = richTextToMarkdown(item.answer || [])
        if (!q) continue
        rebuilt.push(`${qLevel} ${q}`, '')
        if (a) rebuilt.push(a, '')
      }
      lines.splice(start, end - start, ...rebuilt)
    }
  }

  // 4e. Video embeds — the scrape renders a YouTube embed as its thumbnail
  //     image (i.ytimg.com/vi/<id>/...). Swap in the <YouTube> component before
  //     image download would save the thumbnail as an article image.
  lines = lines.map((line) => {
    const im = line.trim().match(/^!\[[^\]]*\]\(([^)]*ytimg\.com[^)]*)\)$/)
    if (!im) return line
    const idMatch = im[1].match(/(?:%2Fvi%2F|\/vi\/)([A-Za-z0-9_-]{11})/)
    return idMatch ? `<YouTube id="${idMatch[1]}" />` : line
  })

  // 4f. Code blocks — drop the copy-button text the scrape captures as a bare
  //     "Copy" line before each fence, and tag every untagged fence with the
  //     language recorded in the article's code_snippet slices (matched by
  //     first-line content, document order as fallback).
  const snippets = []
  for (const s of slices) {
    if (s.slice_type !== 'code_snippet') continue
    for (const item of s.items || []) {
      snippets.push({
        language: (item.language || '').toLowerCase(),
        firstLine: (((item.code || [])[0] || {}).text || '').split('\n')[0].trim(),
      })
    }
  }
  const LANG_MAP = { javascript: 'js', typescript: 'ts', shell: 'bash', sh: 'bash', markup: 'html', node: 'js' }
  const processed = []
  let fenceOpen = false
  let snippetCursor = 0
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim()
    if (!fenceOpen && t === 'Copy') {
      let j = i + 1
      while (j < lines.length && lines[j].trim() === '') j++
      if (j < lines.length && lines[j].trim().startsWith('```')) continue
    }
    if (t.startsWith('```')) {
      if (!fenceOpen) {
        fenceOpen = true
        if (t === '```' && snippets.length) {
          let j = i + 1
          while (j < lines.length && lines[j].trim() === '') j++
          const firstCode = (lines[j] || '').trim()
          let pick = snippets.findIndex((sn, k) => k >= snippetCursor && sn.firstLine && sn.firstLine === firstCode)
          if (pick === -1) pick = snippetCursor < snippets.length ? snippetCursor : -1
          if (pick !== -1) {
            snippetCursor = pick + 1
            const lang = LANG_MAP[snippets[pick].language] || snippets[pick].language
            processed.push('```' + lang)
            continue
          }
        }
      } else {
        fenceOpen = false
      }
    }
    processed.push(lines[i])
  }
  lines = processed

  // 5. Fix FAQ headings scraped as "### \#\#\# Question" (escaped literal hashes).
  lines = lines.map((l) => l.replace(/^(#{1,6})\s+\\#\\#\\#\s*/, '$1 '))

  // 6. Prismic product CTA — the "Try editing a page with Prismic" page-builder
  //    promo (heading + blurb + screenshot + "Try the Page Builder"). Remove the
  //    section up to the next heading.
  const promoIdx = lines.findIndex((l) => /^#{2,4}\s+Try editing a page with Prismic/i.test(l))
  if (promoIdx !== -1) {
    let end = promoIdx + 1
    while (end < lines.length && !/^#{2,4}\s/.test(lines[end])) end++
    lines.splice(promoIdx, end - promoIdx)
  }

  // 7. Drop empty headings left behind after widget/accordion content was stripped
  //    (e.g. "## Related Posts", answerless FAQ questions). A heading is "empty"
  //    when the next non-blank line is EOF or a heading at the same-or-shallower
  //    level (so section headings with real subsections are preserved). Iterate,
  //    since removing one empty heading can expose another above it.
  for (let changed = true; changed; ) {
    changed = false
    const res = []
    for (let i = 0; i < lines.length; i++) {
      const hm = lines[i].match(/^(#{1,6})\s/)
      if (hm) {
        let j = i + 1
        while (j < lines.length && lines[j].trim() === '') j++
        const next = j < lines.length ? lines[j].match(/^(#{1,6})\s/) : null
        if (j >= lines.length || (next && next[1].length <= hm[1].length)) {
          changed = true
          continue
        }
      }
      res.push(lines[i])
    }
    lines = res
  }

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

// ─── Core: import one scraped document ────────────────────────────────────────
async function importDocument(doc, clientSlug, sourceUrl) {
  const meta = doc.metadata || {}
  const markdown = doc.markdown || ''
  if (!markdown.trim()) {
    console.warn(`  ⚠ Skipped — no markdown content for ${sourceUrl}`)
    return
  }

  // Prefer the schema.org headline (the real, full article title) over the
  // SEO <title>/og:title, which AltexSoft truncates to ~60 chars.
  let title = (
    extractSchemaHeadline(doc.rawHtml || doc.html || '') ||
    meta.title ||
    meta.ogTitle ||
    'Untitled'
  ).trim()
  // Smashing's <title>/og:title append " — Smashing Magazine"; drop the suffix.
  if (clientSlug === 'smashing-magazine') {
    title = title.replace(/\s+—\s+Smashing Magazine$/i, '').trim()
  }
  const originalUrl = meta.sourceURL || meta.url || sourceUrl
  const publishedAt =
    toIsoDate(meta.publishedTime) ||
    toIsoDate(meta.dcDateCreated) ||
    toIsoDate(meta.dcDate) ||
    // schema.org datePublished — covers sites (AltexSoft) with no date <meta>.
    extractSchemaDate(doc.rawHtml || doc.html || '') ||
    toIsoDate(meta.modifiedTime) ||
    new Date().toISOString().slice(0, 10)
  const excerpt = (meta.description || meta.ogDescription || '').trim()

  // Slug mirrors the original URL's last path segment; fall back to the title.
  const slug = slugFromUrl(originalUrl) || slugify(title)
  const clientName = clientDisplayName(clientSlug)

  // Resolve target number, prompting if this slug was already imported.
  let number = nextNumber(clientSlug)
  const existing = findExistingBySlug(clientSlug, slug)
  if (existing) {
    const answer = await prompt(
      `  ? "${title}" already exists as ${existing}. Overwrite? [y/N] `,
    )
    if (answer !== 'y' && answer !== 'yes') {
      console.log(`  ↷ Skipped (kept existing ${existing})`)
      return
    }
    number = existing.match(/^(\d+)-/)[1]
  }

  const articleFolder = `${number}-${slug}`
  const imageDestDir = path.join(PUBLIC_DIR, clientSlug, articleFolder)
  const publicBase = `/portfolio/${clientSlug}/${articleFolder}`

  // Client-specific cleanup. AltexSoft pages carry template chrome that
  // onlyMainContent leaves behind; strip it automatically and restore any
  // YouTube embeds found in the page's schema.org data. Scoped to AltexSoft —
  // other clients pass through untouched.
  let cleanedMarkdown = markdown
  if (clientSlug === 'altexsoft') {
    cleanedMarkdown = altexsoftCleanup(markdown, extractSchemaVideos(doc.rawHtml || doc.html || ''))
  } else if (clientSlug === 'smashing-magazine') {
    cleanedMarkdown = smashingCleanup(markdown)
  } else if (clientSlug === 'prismic') {
    // Slice data recovered from the page's flight data drives the table/FAQ/
    // video/code-language reconstruction — see extractPrismicSlices.
    cleanedMarkdown = prismicCleanup(markdown, extractPrismicSlices(doc.rawHtml || doc.html || ''))
  }

  // Convert standalone tweet/YouTube/LinkedIn links into component tags first,
  // so embed thumbnails aren't mistaken for downloadable article images.
  const { content: contentWithEmbeds, count: embedCount } = convertEmbeds(cleanedMarkdown)

  // Download images and rewrite the markdown to local absolute URLs.
  let content = contentWithEmbeds
  const imageUrls = extractImageUrls(content)
  let downloaded = 0
  for (let i = 0; i < imageUrls.length; i++) {
    const url = imageUrls[i]
    try {
      const fileName = await downloadImage(url, imageDestDir, i + 1)
      const localUrl = `${publicBase}/${fileName}`
      content = content.split(url).join(localUrl)
      downloaded++
    } catch (err) {
      console.warn(`  ⚠ Image download failed (${url}): ${err.message} — keeping remote URL`)
    }
  }

  // Optional cover image from og:image (downloaded as cover.*).
  let coverImage
  if (meta.ogImage) {
    try {
      const res = await fetch(meta.ogImage)
      if (res.ok) {
        const rawExt = extImageFromUrl(meta.ogImage, res.headers.get('content-type'))
        const raw = Buffer.from(await res.arrayBuffer())
        const { buf, ext } = await webpIfRaster(raw, rawExt)
        fs.mkdirSync(imageDestDir, { recursive: true })
        fs.writeFileSync(path.join(imageDestDir, `cover${ext}`), buf)
        coverImage = `${publicBase}/cover${ext}`
      }
    } catch {
      /* cover is optional — ignore failures */
    }
  }

  const frontmatter = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `client: ${JSON.stringify(clientName)}`,
    `clientSlug: ${JSON.stringify(clientSlug)}`,
    `originalUrl: ${JSON.stringify(originalUrl)}`,
    `publishedAt: ${JSON.stringify(publishedAt)}`,
    `canonical: ${JSON.stringify(originalUrl)}`,
    `excerpt: ${JSON.stringify(excerpt)}`,
    ...(coverImage ? [`coverImage: ${JSON.stringify(coverImage)}`] : []),
    `tags: ${JSON.stringify(meta.keywords ? toTags(meta.keywords) : [])}`,
    '---',
    '',
  ].join('\n')

  const outDir = path.join(CONTENT_DIR, clientSlug)
  fs.mkdirSync(outDir, { recursive: true })
  const outFile = path.join(outDir, `${articleFolder}.mdx`)
  fs.writeFileSync(outFile, frontmatter + sanitizeMdx(content).trim() + '\n')

  console.log(`  ✓ ${title}`)
  console.log(`    images: ${downloaded}/${imageUrls.length}${coverImage ? ' (+cover)' : ''}`)
  console.log(`    embeds: ${embedCount} (tweet/youtube/linkedin → component tags)`)
  console.log(`    output: ${path.relative(ROOT, outFile)}`)
}

function toTags(keywords) {
  const arr = Array.isArray(keywords) ? keywords : String(keywords).split(',')
  return arr.map((k) => k.trim()).filter(Boolean).slice(0, 5)
}

// ─── Scrape one URL, with error isolation ─────────────────────────────────────
async function scrapeAndImport(client, clientSlug, url) {
  console.log(`\n→ Scraping ${url}`)
  let doc
  try {
    doc = await client.scrape(url, {
      formats: ['markdown', 'rawHtml'],
      onlyMainContent: true,
    })
  } catch (err) {
    console.error(`  ✗ FireCrawl error: ${err.message} — skipping`)
    return
  }
  try {
    await importDocument(doc, clientSlug, url)
  } catch (err) {
    console.error(`  ✗ Import error: ${err.message} — skipping`)
  }
}

// ─── Modes ────────────────────────────────────────────────────────────────────
async function runSingle(client, clientSlug, url) {
  await scrapeAndImport(client, clientSlug, url)
}

async function runBatch(client, clientSlug, file) {
  const filePath = path.isAbsolute(file) ? file : path.join(process.cwd(), file)
  if (!fs.existsSync(filePath)) throw new Error(`Batch file not found: ${filePath}`)
  // Extract the first URL on each line, so the file can be a plain list, a
  // numbered list ("1. https://…"), a markdown list ("- https://…"), etc.
  // Lines starting with # are treated as comments.
  const urls = fs
    .readFileSync(filePath, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      const m = l.match(/https?:\/\/\S+/)
      return m ? m[0].replace(/[).,;]+$/, '') : null
    })
    .filter(Boolean)
  console.log(`Batch: ${urls.length} URL(s) from ${file}`)
  for (const url of urls) {
    await scrapeAndImport(client, clientSlug, url)
  }
}

async function runCrawl(client, clientSlug, authorUrl) {
  console.log(`Crawling author page: ${authorUrl}`)
  let job
  try {
    job = await client.crawl(authorUrl, {
      limit: 100,
      scrapeOptions: { formats: ['markdown', 'rawHtml'], onlyMainContent: true },
    })
  } catch (err) {
    console.error(`✗ Crawl failed: ${err.message}`)
    return
  }
  const docs = (job && job.data) || []
  console.log(`Discovered ${docs.length} page(s).`)
  for (const doc of docs) {
    const url = (doc.metadata && (doc.metadata.sourceURL || doc.metadata.url)) || '(unknown)'
    console.log(`\n→ ${url}`)
    try {
      await importDocument(doc, clientSlug, url)
    } catch (err) {
      console.error(`  ✗ Import error: ${err.message} — skipping`)
    }
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  loadEnvLocal()
  const args = parseArgs(process.argv.slice(2))

  const clientSlug = typeof args.client === 'string' ? args.client : null
  if (!clientSlug) {
    console.error('Error: --client <slug> is required (e.g. --client altexsoft)')
    process.exit(1)
  }

  const apiKey = process.env.FIRECRAWL_API_KEY
  if (!apiKey) {
    console.error('Error: FIRECRAWL_API_KEY is not set. Add it to .env.local.')
    process.exit(1)
  }

  const client = new Firecrawl({ apiKey })

  if (typeof args.url === 'string') {
    await runSingle(client, clientSlug, args.url)
  } else if (typeof args.batch === 'string') {
    await runBatch(client, clientSlug, args.batch)
  } else if (typeof args.crawl === 'string') {
    await runCrawl(client, clientSlug, args.crawl)
  } else {
    console.error('Error: provide one of --url <url>, --batch <file>, or --crawl <authorUrl>')
    process.exit(1)
  }

  console.log('\nDone.')
}

// Run only when invoked directly, so the helpers can be unit-tested via require.
if (require.main === module) {
  main().catch((err) => {
    console.error('Fatal:', err)
    process.exit(1)
  })
}

module.exports = {
  convertEmbeds,
  embedTagForUrl,
  standaloneUrl,
  altexsoftCleanup,
  extractSchemaVideos,
  extractSchemaDate,
  extractSchemaHeadline,
  sanitizeMdx,
  slugFromUrl,
  prismicCleanup,
  extractPrismicSlices,
  richTextToMarkdown,
}
