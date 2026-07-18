import 'server-only'
import { cache } from 'react'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// ─── Prompt library data layer ────────────────────────────────────────────────
// Mirrors lib/posts.ts. Each prompt is a Markdown file in content/prompts/ whose
// body is the raw prompt text — displayed verbatim and copied as-is, NOT run
// through the MDX compiler (prompts contain {variables} and <placeholders> that
// MDX would try to parse). Frontmatter carries the metadata.
//
// When migrating to Prismic, only the functions below need to change; keep the
// Prompt interface stable — it is the contract with the consuming components.

/** Each library item is either a reusable prompt or a Claude/AI skill. */
export type ResourceType = 'Prompt' | 'Skill'

export interface Prompt {
  slug: string
  title: string
  /** Prompt vs. Skill — the primary filter axis on the library. */
  type: ResourceType
  /** Free-form category label, e.g. "LinkedIn Post". Filtered case-insensitively;
   *  the category list on the index is derived from whatever categories exist. */
  category: string
  description: string
  /** ISO date (YYYY-MM-DD). */
  dateAdded: string
  /** The raw prompt/skill text — displayed verbatim and copied as-is. */
  content: string
}

export type PromptMeta = Omit<Prompt, 'content'>

const PROMPTS_DIR = path.join(process.cwd(), 'content', 'prompts')

function parseFile(file: string): Prompt {
  const slug = file.replace(/\.md$/, '')
  const raw = fs.readFileSync(path.join(PROMPTS_DIR, file), 'utf8')
  const { data, content } = matter(raw)
  return {
    slug: (data.slug as string) || slug,
    title: data.title as string,
    type: (data.type as ResourceType) === 'Skill' ? 'Skill' : 'Prompt',
    category: (data.category as string) ?? 'Uncategorized',
    description: data.description as string,
    dateAdded: data.dateAdded as string,
    content: content.trim(),
  }
}

// cache(): deduped across callers in a render pass (index, category filter,
// sitemap) instead of re-reading the directory each time.
export const getAllPrompts = cache(async (): Promise<PromptMeta[]> => {
  if (!fs.existsSync(PROMPTS_DIR)) return []
  return fs
    .readdirSync(PROMPTS_DIR)
    .filter((f) => f.endsWith('.md'))
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map((f) => { const { content, ...meta } = parseFile(f); return meta })
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
})

// cache(): generateMetadata and the page component both call this per request.
export const getPromptBySlug = cache(async (slug: string): Promise<Prompt | null> => {
  const filePath = path.join(PROMPTS_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null
  return parseFile(`${slug}.md`)
})

/** Prompts in a single category, newest first. Case-insensitive match. */
export async function getPromptsByCategory(category: string): Promise<PromptMeta[]> {
  const all = await getAllPrompts()
  const key = category.trim().toLowerCase()
  return all.filter((p) => p.category.trim().toLowerCase() === key)
}

export { formatDate } from './utils'
