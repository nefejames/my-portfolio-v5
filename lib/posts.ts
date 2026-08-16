import 'server-only'
import { cache } from 'react'
import { createClient } from '@/prismicio'

// ─── Types ───────────────────────────────────────────────────────────────────
// Keep this interface stable — it is the contract between the content layer
// and all consuming components.

export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  coverImage?: string
  /** When true, this post is surfaced in the homepage "Writing for my own brand" section. */
  featured: boolean
  content: string
}

export type PostMeta = Omit<Post, 'content'>

// ─── Prismic implementation ───────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDocument(doc: any): Post {
  return {
    slug: doc.uid,
    title: doc.data.title ?? '',
    date: doc.data.date ?? '',
    excerpt: doc.data.excerpt ?? '',
    tags: doc.tags ?? [],
    coverImage: doc.data.cover_image ?? undefined,
    featured: doc.data.featured ?? false,
    content: doc.data.body_mdx ?? '',
  }
}

// Tags/categories are case-insensitive: "Musings" and "musings" are the same
// category everywhere. The first casing used — by the oldest post — becomes
// canonical, so later variants collapse onto it and acronyms like "SEO" stay.
//
// NOTE: This map is NOT built by calling getAllPosts() to avoid a circular
// async dependency. getAllPosts → canonicalizeTags → getTagCanonicalMap →
// getAllPosts would deadlock because React cache() returns the same in-flight
// promise. Instead, getAllPosts builds the map inline from raw Prismic docs.
// getTagCanonicalMap is only kept for getPostBySlug / getRelatedPosts, where
// getAllPosts is called in a separate concurrent branch (Promise.all) so the
// cached promise resolves before getTagCanonicalMap awaits it.
const getTagCanonicalMap = cache(async (): Promise<Map<string, string>> => {
  const posts = await getAllPosts()
  const map = new Map<string, string>()
  for (const post of [...posts].reverse()) {
    for (const tag of post.tags) {
      const key = tag.trim().toLowerCase()
      if (key && !map.has(key)) map.set(key, tag.trim())
    }
  }
  return map
})

async function canonicalizeTags(tags: string[]): Promise<string[]> {
  const map = await getTagCanonicalMap()
  const seen = new Set<string>()
  const out: string[] = []
  for (const tag of tags) {
    const key = tag.trim().toLowerCase()
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(map.get(key) ?? tag.trim())
  }
  return out
}

function applyTagMap(tags: string[], map: Map<string, string>): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const tag of tags) {
    const key = tag.trim().toLowerCase()
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(map.get(key) ?? tag.trim())
  }
  return out
}

export const getAllPosts = cache(async (): Promise<PostMeta[]> => {
  // During `next build`, the Prismic CDN may be unreachable (build-environment
  // proxy allowlist). Return empty so static pages build without a 60-second hang;
  // ISR revalidation fills in the real data at runtime.
  if (process.env.NEXT_PHASE === 'phase-production-build') return []
  try {
    // Promise.race provides a hard timeout in pure JS — cannot be stripped by
    // Next.js's fetch interceptor the way AbortSignal in fetchOptions can be.
    const docs = await Promise.race([
      createClient().getAllByType('blog_post', {
        orderings: [{ field: 'my.blog_post.date', direction: 'desc' }],
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Prismic timeout')), 8000),
      ),
    ])

    // Build the canonical-tag map from all docs in one synchronous pass.
    // Doing this inline (rather than calling canonicalizeTags, which calls
    // getTagCanonicalMap, which awaits getAllPosts) avoids the circular deadlock.
    const tagMap = new Map<string, string>()
    const rawPosts = docs.map((doc) => {
      const { content: _content, ...meta } = mapDocument(doc)
      return meta
    })
    for (const post of [...rawPosts].reverse()) {
      for (const tag of post.tags) {
        const key = tag.trim().toLowerCase()
        if (key && !tagMap.has(key)) tagMap.set(key, tag.trim())
      }
    }

    return rawPosts.map((post) => ({ ...post, tags: applyTagMap(post.tags, tagMap) }))
  } catch {
    return []
  }
})

/** Featured posts for the homepage "Writing for my own brand" section. */
export async function getFeaturedPosts(limit = 6): Promise<PostMeta[]> {
  const posts = await getAllPosts()
  return posts.filter((p) => p.featured).slice(0, limit)
}

export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  const client = createClient()
  try {
    const doc = await client.getByUID('blog_post', slug)
    const post = mapDocument(doc)
    return { ...post, tags: await canonicalizeTags(post.tags) }
  } catch {
    return null
  }
})

function scoreByTagOverlap<T extends { tags: string[] }>(tags: string[], items: T[]): T[] {
  const tagSet = new Set(tags.map((t) => t.toLowerCase()))
  return items
    .map((item, idx) => ({
      item,
      score: item.tags.filter((t) => tagSet.has(t.toLowerCase())).length,
      idx,
    }))
    .sort((a, b) => b.score - a.score || a.idx - b.idx)
    .map(({ item }) => item)
}

/** Up to `limit` blog posts most related to `slug` by tag overlap. */
export async function getRelatedPosts(slug: string, limit = 3): Promise<PostMeta[]> {
  const [current, all] = await Promise.all([getPostBySlug(slug), getAllPosts()])
  if (!current) return []
  const others = all.filter((p) => p.slug !== slug)
  return scoreByTagOverlap(current.tags, others).slice(0, limit)
}

export { formatDate } from './utils'
