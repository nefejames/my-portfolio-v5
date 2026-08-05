import { getAllPosts } from '@/lib/posts'
import { SITE, absoluteUrl } from '@/lib/site'

// RSS 2.0 feed for the blog, served at /rss.xml. Static (regenerated per deploy),
// since posts are read from the filesystem at build time.
export const dynamic = 'force-static'

const escape = (s: string) =>
  s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]!))

export async function GET() {
  const posts = await getAllPosts()
  const feedUrl = absoluteUrl('/rss.xml')
  const lastBuild = posts[0]?.date ? new Date(posts[0].date) : new Date()

  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/blog/${post.slug}`)
      return `    <item>
      <title>${escape(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escape(post.excerpt)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
${post.tags.map((t) => `      <category>${escape(t)}</category>`).join('\n')}
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(SITE.name)} — Blog</title>
    <link>${absoluteUrl('/blog')}</link>
    <description>${escape(SITE.description)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuild.toUTCString()}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
