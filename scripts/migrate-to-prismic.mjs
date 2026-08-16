/**
 * One-time migration script: pushes all MDX blog posts into the Prismic
 * repository using the Migration API.
 *
 * Prerequisites:
 *   1. Custom type `blog_post` must already exist in Prismic
 *      (create it at https://nefe-portfolio.prismic.io/builder/types/custom-types)
 *   2. Set this environment variable:
 *        PRISMIC_WRITE_API_TOKEN   — from Settings → API & Security → Write API tokens
 *
 * Usage:
 *   PRISMIC_WRITE_API_TOKEN=your_token node scripts/migrate-to-prismic.mjs
 *
 * Safe to re-run: documents with the same UID are updated, not duplicated.
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

// ─── Build and execute migration ──────────────────────────────────────────────

async function run() {
  const posts = readBlogPosts()

  console.log(`Found ${posts.length} blog posts.`)

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
