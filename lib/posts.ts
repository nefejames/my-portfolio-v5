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
  content: string
}

export type PostMeta = Omit<Post, 'content'>

// ─── File-system implementation (swap for Prismic client later) ───────────────

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts')

export async function getAllPosts(): Promise<PostMeta[]> {
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
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    excerpt: data.excerpt as string,
    tags: (data.tags as string[]) ?? [],
    coverImage: data.coverImage as string | undefined,
    content,
  }
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
