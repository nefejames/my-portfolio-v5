import Link from 'next/link'
import { getFeaturedPosts } from '@/lib/posts'
import { formatDate } from '@/lib/utils'

export default async function BlogPreview() {
  // Curated per-post: add `featured: true` to a blog post's frontmatter to show
  // it here. Max 6; the grid is omitted entirely when nothing is featured yet.
  const featured = await getFeaturedPosts(6)

  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[var(--accent-text)] mb-4">
              From my blog
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text)]">
              Writing for my own brand
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden md:inline-flex text-sm font-medium text-[var(--accent-text)] hover:text-[var(--accent-text)] transition-colors"
          >
            View all posts →
          </Link>
        </div>

        {featured.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            {featured.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-3 p-6 border border-[var(--border)] rounded-xl hover:border-[var(--accent-text)] hover:shadow-sm transition-all"
              >
                <time className="text-xs text-[var(--muted)]">{formatDate(post.date)}</time>
                <h3 className="text-base font-semibold text-[var(--text)] group-hover:text-[var(--accent-text)] transition-colors leading-snug">
                  {post.title}
                </h3>
                <div className="flex flex-wrap gap-2 pt-2 mt-auto">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium px-2.5 py-1 bg-[var(--surface-2)] text-[var(--muted)] rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 md:hidden">
          <Link
            href="/blog"
            className="text-sm font-medium text-[var(--accent-text)] hover:text-[var(--accent-text)] transition-colors"
          >
            View all posts →
          </Link>
        </div>
      </div>
    </section>
  )
}
