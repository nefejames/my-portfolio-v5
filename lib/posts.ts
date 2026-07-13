import 'server-only'
import { cache } from 'react'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// ─── Types ───────────────────────────────────────────────────────────────────
// When migrating to Prismic, only the functions below need to change.
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

// ─── File-system implementation (swap for Prismic client later) ───────────────

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts')

// Read every post's frontmatter with tags exactly as authored, newest first.
// Kept separate from getAllPosts so the tag-canonicalisation map (below) can be
// built without recursion. cache(): read the directory once per render.
const readAllRawMeta = cache((): PostMeta[] => {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.mdx'))

  return files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '')
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8')
      const { data } = matter(raw)
      return {
        slug,
        title: data.title as string,
        date: data.date as string,
        excerpt: data.excerpt as string,
        tags: (data.tags as string[]) ?? [],
        coverImage: data.coverImage as string | undefined,
        featured: (data.featured as boolean) ?? false,
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

// Tags/categories are case-insensitive: "Musings" and "musings" are the same
// category everywhere (chips, cards, post pages, search). The first casing ever
// used for a tag — by the oldest post — becomes the canonical label, so later
// case-variants collapse onto it and acronyms like "SEO" are preserved. Zero
// maintenance: the category list is still just whatever tags exist.
const getTagCanonicalMap = cache((): Map<string, string> => {
  const map = new Map<string, string>()
  for (const post of [...readAllRawMeta()].reverse()) {
    for (const tag of post.tags) {
      const key = tag.trim().toLowerCase()
      if (key && !map.has(key)) map.set(key, tag.trim())
    }
  }
  return map
})

/** Map a post's raw tags to their canonical casing, de-duped case-insensitively. */
function canonicalizeTags(tags: string[]): string[] {
  const map = getTagCanonicalMap()
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

// cache(): deduped across callers within one render pass (blog index, featured
// section, sitemap) instead of re-reading the posts directory each time.
export const getAllPosts = cache(async (): Promise<PostMeta[]> =>
  readAllRawMeta().map((p) => ({ ...p, tags: canonicalizeTags(p.tags) })),
)

/** Featured posts for the homepage "Writing for my own brand" section, newest
 *  first, capped at `limit`. Returns [] when none are featured. */
export async function getFeaturedPosts(limit = 6): Promise<PostMeta[]> {
  const posts = await getAllPosts()
  return posts.filter((p) => p.featured).slice(0, limit)
}

// cache(): generateMetadata and the page component both call this per request.
export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    excerpt: data.excerpt as string,
    tags: canonicalizeTags((data.tags as string[]) ?? []),
    coverImage: data.coverImage as string | undefined,
    featured: (data.featured as boolean) ?? false,
    content,
  }
})

export { formatDate } from './utils'
