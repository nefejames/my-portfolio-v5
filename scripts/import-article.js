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

async function downloadImage(url, destDir, index, contentTypeHint) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const contentType = res.headers.get('content-type') || contentTypeHint
  const ext = extImageFromUrl(url, contentType)
  const fileName = `image-${index}${ext}`
  const buf = Buffer.from(await res.arrayBuffer())
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

function collectArticleDates(node, acc) {
  if (!node || typeof node !== 'object') return
  if (Array.isArray(node)) {
    for (const item of node) collectArticleDates(item, acc)
    return
  }
  const type = node['@type']
  const isArticle =
    (typeof type === 'string' && ARTICLE_TYPES.includes(type)) ||
    (Array.isArray(type) && type.some((t) => ARTICLE_TYPES.includes(t)))
  if (isArticle && node.datePublished) acc.push(node.datePublished)
  for (const key of Object.keys(node)) {
    if (key === '@type') continue
    collectArticleDates(node[key], acc)
  }
}

/** Extract the article's publish date (YYYY-MM-DD) from schema.org JSON-LD, or
 *  null if none is found. */
function extractSchemaDate(html) {
  if (!html) return null
  const dates = []
  const scriptRe = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  let m
  while ((m = scriptRe.exec(html)) !== null) {
    try {
      collectArticleDates(JSON.parse(m[1].trim()), dates)
    } catch {
      /* skip malformed JSON-LD blocks */
    }
  }
  return dates.length ? toIsoDate(dates[0]) : null
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

  // Step 3 — Remove the "Related Articles" sidebar: the heading and everything
  // until the next H2 (## ...).
  const relStart = lines.findIndex((l) => /^##\s+Related Articles/i.test(l))
  if (relStart !== -1) {
    let relEnd = lines.findIndex((l, i) => i > relStart && /^##\s+/.test(l))
    if (relEnd === -1) relEnd = lines.length
    lines.splice(relStart, relEnd - relStart)
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

// ─── Core: import one scraped document ────────────────────────────────────────
async function importDocument(doc, clientSlug, sourceUrl) {
  const meta = doc.metadata || {}
  const markdown = doc.markdown || ''
  if (!markdown.trim()) {
    console.warn(`  ⚠ Skipped — no markdown content for ${sourceUrl}`)
    return
  }

  const title = (meta.title || meta.ogTitle || 'Untitled').trim()
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

  const slug = slugify(title)
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
  const cleanedMarkdown =
    clientSlug === 'altexsoft'
      ? altexsoftCleanup(markdown, extractSchemaVideos(doc.rawHtml || doc.html || ''))
      : markdown

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
        const ext = extImageFromUrl(meta.ogImage, res.headers.get('content-type'))
        const buf = Buffer.from(await res.arrayBuffer())
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
  fs.writeFileSync(outFile, frontmatter + content.trim() + '\n')

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
}
