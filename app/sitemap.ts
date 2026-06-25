import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/site'
import { getAllPosts } from '@/lib/posts'

// Generates /sitemap.xml. Intentionally excluded:
//   • /logos                       — noindex (design scratchpad)
//   • /portfolio/[client]/[slug]   — these declare an external rel=canonical to
//     the original publication, so listing them here would send mixed signals.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE.url}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
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
  ]
}
