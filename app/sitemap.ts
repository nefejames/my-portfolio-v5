import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/site'
import { getAllPosts } from '@/lib/posts'
import { getAllPortfolioArticles } from '@/lib/portfolio'

// Generates /sitemap.xml. Intentionally excluded:
//   • /logos — noindex (design scratchpad)
//
// Portfolio articles ARE listed despite declaring an external rel=canonical to
// the original publication. Google may report them as "duplicate, not selected
// as canonical" (harmless), but AI crawlers use the sitemap for discovery —
// the archive is the body of work that makes the author citable.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, articles] = await Promise.all([getAllPosts(), getAllPortfolioArticles()])

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE.url}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE.url}/portfolio/${a.clientSlug}/${a.slug}`,
    lastModified: new Date(a.publishedAt),
    changeFrequency: 'yearly',
    priority: 0.3,
  }))

  const newestPost = posts[0]?.date ? new Date(posts[0].date) : new Date()

  return [
    {
      url: SITE.url,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE.url}/blog`,
      lastModified: newestPost,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE.url}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...postEntries,
    ...articleEntries,
  ]
}
