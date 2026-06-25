import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'
import BlogList from '@/components/blog/BlogList'

const description =
  'Thoughts on content marketing, SEO, technical writing, and building a brand in public.'

export const metadata: Metadata = {
  title: 'Blog',
  description,
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    url: '/blog',
    title: 'Blog',
    description,
  },
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 pb-24">
      <div className="mb-12">
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

      <BlogList posts={posts} />
    </div>
  )
}
