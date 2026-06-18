import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'
import BlogCard from '@/components/blog/BlogCard'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts on content marketing, SEO, technical writing, and building a brand in public.',
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 pb-24">
      <div className="mb-16">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#4F46E5] mb-4">
          Blog
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-[#111827] mb-6">
          Writing in public
        </h1>
        <p className="text-lg text-[#6B7280] max-w-xl">
          Thoughts on content marketing, SEO strategy, technical writing, and growing
          an audience as a content professional.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-[#6B7280]">No posts yet — check back soon.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
