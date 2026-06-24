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

  // Convert standalone tweet/YouTube/LinkedIn links into component tags first,
  // so embed thumbnails aren't mistaken for downloadable article images.
  const { content: contentWithEmbeds, count: embedCount } = convertEmbeds(markdown)

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
    doc = await client.scrape(url, { formats: ['markdown'], onlyMainContent: true })
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
  const urls = fs
    .readFileSync(filePath, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
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
      scrapeOptions: { formats: ['markdown'], onlyMainContent: true },
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

module.exports = { convertEmbeds, embedTagForUrl, standaloneUrl }
