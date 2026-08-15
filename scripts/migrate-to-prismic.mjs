/**
 * One-time migration script: pushes all MDX blog posts and portfolio articles
 * into the Prismic repository using the Migration API.
 *
 * Prerequisites:
 *   1. Custom types `blog_post` and `portfolio_article` must already exist in Prismic
 *      (upload customtypes/blog_post/index.json and customtypes/portfolio_article/index.json
 *       via Settings → Custom Types in the Prismic dashboard)
 *   2. Set these environment variables (copy .env.local.example to .env.local and fill them in):
 *        PRISMIC_WRITE_API_TOKEN   — from Settings → API & Security → Write API tokens
 *
 * Usage:
 *   node --env-file=.env.local scripts/migrate-to-prismic.mjs
 *
 * Safe to re-run: Prismic's Migration API is idempotent — documents with the same
 * UID that already exist will be updated, not duplicated.
 */

import { createWriteClient, createMigration } from '@prismicio/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

const REPOSITORY = process.env.PRISMIC_REPOSITORY_NAME || 'nefe-portfolio'
const WRITE_TOKEN = process.env.PRISMIC_WRITE_API_TOKEN

if (!WRITE_TOKEN) {
  console.error('Missing PRISMIC_WRITE_API_TOKEN in environment.')
  console.error('Get it from: https://nefe-portfolio.prismic.io/settings/apps/')
  process.exit(1)
}

// ─── Read blog posts ──────────────────────────────────────────────────────────

const POSTS_DIR = path.join(ROOT, 'content', 'posts')

function readBlogPosts() {
  if (!fs.existsSync(POSTS_DIR)) return []
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '')
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8')
      const { data, content } = matter(raw)
      return {
        slug,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        tags: data.tags ?? [],
        coverImage: data.coverImage ?? null,
        featured: data.featured ?? false,
        content,
      }
    })
}

// ─── Read portfolio articles ──────────────────────────────────────────────────

const PORTFOLIO_DIR = path.join(ROOT, 'content', 'portfolio')

function parseFileName(file) {
  const stem = file.replace(/\.mdx$/, '')
  const match = stem.match(/^(\d+)-(.+)$/)
  if (match) return { order: parseInt(match[1], 10), slug: match[2] }
  return { order: Number.MAX_SAFE_INTEGER, slug: stem }
}

function readPortfolioArticles() {
  if (!fs.existsSync(PORTFOLIO_DIR)) return []
  const articles = []
  const clientSlugs = fs
    .readdirSync(PORTFOLIO_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)

  for (const clientSlug of clientSlugs) {
    const dir = path.join(PORTFOLIO_DIR, clientSlug)
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'))
    for (const file of files) {
      const { order, slug } = parseFileName(file)
      const raw = fs.readFileSync(path.join(dir, file), 'utf8')
      const { data, content } = matter(raw)
      articles.push({
        uid: `${clientSlug}--${slug}`,
        slug,
        order,
        title: data.title,
        client: data.client,
        clientSlug: data.clientSlug ?? clientSlug,
        originalUrl: data.originalUrl,
        publishedAt: data.publishedAt,
        canonical: data.canonical ?? data.originalUrl,
        excerpt: data.excerpt,
        coverImage: data.coverImage ?? null,
        tags: data.tags ?? [],
        featured: data.featured ?? false,
        content,
      })
    }
  }
  return articles
}

// ─── Build and execute migration ──────────────────────────────────────────────

async function run() {
  const posts = readBlogPosts()
  const articles = readPortfolioArticles()

  console.log(`Found ${posts.length} blog posts and ${articles.length} portfolio articles.`)

  const migration = createMigration()

  for (const post of posts) {
    migration.createDocument(
      {
        type: 'blog_post',
        uid: post.slug,
        lang: 'en-us',
        tags: post.tags,
        data: {
          title: post.title,
          date: post.date,
          excerpt: post.excerpt,
          cover_image: post.coverImage ?? null,
          featured: post.featured,
          body_mdx: post.content,
        },
      },
      post.title,
    )
  }

  for (const article of articles) {
    migration.createDocument(
      {
        type: 'portfolio_article',
        uid: article.uid,
        lang: 'en-us',
        tags: article.tags,
        data: {
          title: article.title,
          client: article.client,
          client_slug: article.clientSlug,
          original_url: article.originalUrl,
          published_at: article.publishedAt,
          canonical: article.canonical,
          excerpt: article.excerpt,
          cover_image: article.coverImage ?? null,
          featured: article.featured,
          order: article.order === Number.MAX_SAFE_INTEGER ? 0 : article.order,
          body_mdx: article.content,
        },
      },
      article.title,
    )
  }

  const writeClient = createWriteClient(REPOSITORY, {
    writeToken: WRITE_TOKEN,
  })

  console.log('Starting migration…')
  await writeClient.migrate(migration, {
    reporter: (event) => {
      if (event.type === 'start') {
        console.log(`\nMigrating ${event.data.pending.documents} documents…`)
      }
      if (event.type === 'documents:creating') {
        const doc = event.data.document.document
        process.stdout.write(`  [${event.data.current}/${event.data.total}] Creating: ${doc.data?.title ?? doc.uid}\n`)
      }
      if (event.type === 'documents:updating') {
        const doc = event.data.document.document
        process.stdout.write(`  [${event.data.current}/${event.data.total}] Updating: ${doc.data?.title ?? doc.uid}\n`)
      }
      if (event.type === 'end') {
        console.log(`\nDone. Migrated ${event.data.migrated.documents} documents.`)
      }
    },
  })
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
