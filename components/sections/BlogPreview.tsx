import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { formatDate } from '@/lib/utils'

export default async function BlogPreview() {
  const posts = await getAllPosts()
  const recent = posts.slice(0, 3)

  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#4F46E5] mb-4">
              From the blog
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827]">
              Writing for my own brand
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden md:inline-flex text-sm font-medium text-[#4F46E5] hover:text-[#4338CA] transition-colors"
          >
            View all posts →
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="text-[#6B7280]">No posts yet — check back soon.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {recent.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-3 p-6 border border-[#E5E7EB] rounded-xl hover:border-[#4F46E5] hover:shadow-sm transition-all"
              >
                <time className="text-xs text-[#6B7280]">{formatDate(post.date)}</time>
                <h3 className="text-base font-semibold text-[#111827] group-hover:text-[#4F46E5] transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed flex-1">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium px-2.5 py-1 bg-[#F3F4F6] text-[#6B7280] rounded-md"
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
            className="text-sm font-medium text-[#4F46E5] hover:text-[#4338CA] transition-colors"
          >
            View all posts →
          </Link>
        </div>
      </div>
    </section>
  )
}
