import 'server-only'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { clientLogo } from './clients'

// ─── Types ───────────────────────────────────────────────────────────────────
// Portfolio articles are client work imported from external publications. They
// share the blog's MDX renderer (see app/portfolio/[client]/[slug]/page.tsx),
// but carry extra attribution metadata: the original publication, its URL, and
// a canonical link. Like lib/posts.ts, this interface is the stable contract
// between the content layer and the UI — swap the fs implementation for a CMS
// later without touching consumers.

export interface PortfolioArticle {
  /** kebab-case slug derived from the title, without the numeric prefix */
  slug: string
  /** zero-padded order extracted from the filename (oldest = lowest) */
  order: number
  title: string
  /** display name, e.g. "AltexSoft" */
  client: string
  /** url segment, e.g. "altexsoft" */
  clientSlug: string
  originalUrl: string
  /** ISO date string, e.g. "2023-04-12" */
  publishedAt: string
  canonical: string
  excerpt: string
  coverImage?: string
  tags: string[]
  /** When true, this article is surfaced in the homepage "Selected work" section. */
  featured: boolean
  content: string
}

export type PortfolioMeta = Omit<PortfolioArticle, 'content'>

// ─── File-system implementation (swap for a CMS client later) ─────────────────

const PORTFOLIO_DIR = path.join(process.cwd(), 'content', 'portfolio')

/** `001-article-title.mdx` → { order: 1, slug: "article-title" } */
function parseFileName(file: string): { order: number; slug: string } {
  const stem = file.replace(/\.mdx$/, '')
  const match = stem.match(/^(\d+)-(.+)$/)
  if (match) return { order: parseInt(match[1], 10), slug: match[2] }
  // Tolerate files without a numeric prefix — order them last.
  return { order: Number.MAX_SAFE_INTEGER, slug: stem }
}

function listClientSlugs(): string[] {
  if (!fs.existsSync(PORTFOLIO_DIR)) return []
  return fs
    .readdirSync(PORTFOLIO_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
}

function readArticle(clientSlug: string, file: string): PortfolioArticle {
  const { order, slug } = parseFileName(file)
  const raw = fs.readFileSync(path.join(PORTFOLIO_DIR, clientSlug, file), 'utf8')
  const { data, content } = matter(raw)

  return {
    slug,
    order,
    title: data.title as string,
    client: data.client as string,
    clientSlug: (data.clientSlug as string) ?? clientSlug,
    originalUrl: data.originalUrl as string,
    publishedAt: data.publishedAt as string,
    canonical: (data.canonical as string) ?? (data.originalUrl as string),
    excerpt: data.excerpt as string,
    coverImage: data.coverImage as string | undefined,
    tags: (data.tags as string[]) ?? [],
    featured: (data.featured as boolean) ?? false,
    content,
  }
}

function listArticleFiles(clientSlug: string): string[] {
  const dir = path.join(PORTFOLIO_DIR, clientSlug)
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'))
}

/** All articles across every client, sorted newest first. */
export async function getAllPortfolioArticles(): Promise<PortfolioMeta[]> {
  const metas: PortfolioMeta[] = []

  for (const clientSlug of listClientSlugs()) {
    for (const file of listArticleFiles(clientSlug)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { content, ...meta } = readArticle(clientSlug, file)
      metas.push(meta)
    }
  }

  return metas.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
}

/** Featured articles for the homepage "Selected work" section, newest first,
 *  capped at `limit`. Returns [] when nothing is featured — callers render
 *  an empty section gracefully rather than filling with placeholders. */
export async function getFeaturedPortfolioArticles(limit = 6): Promise<PortfolioMeta[]> {
  const articles = await getAllPortfolioArticles()
  return articles.filter((a) => a.featured).slice(0, limit)
}

/** Distinct clients present in the content folder, with display names and the
 *  wordmark logo path when an asset exists (else null → UI falls back to text). */
export async function getPortfolioClients(): Promise<
  { slug: string; name: string; logo: string | null }[]
> {
  const articles = await getAllPortfolioArticles()
  const map = new Map<string, string>()
  for (const a of articles) {
    if (!map.has(a.clientSlug)) map.set(a.clientSlug, a.client)
  }
  return Array.from(map, ([slug, name]) => ({ slug, name, logo: clientLogo(slug) })).sort(
    (a, b) => a.name.localeCompare(b.name),
  )
}

/** Resolve a single article by client + slug (slug = title-based, no number). */
export async function getPortfolioArticle(
  clientSlug: string,
  slug: string,
): Promise<PortfolioArticle | null> {
  for (const file of listArticleFiles(clientSlug)) {
    if (parseFileName(file).slug === slug) {
      return readArticle(clientSlug, file)
    }
  }
  return null
}

export { formatDate } from './utils'
