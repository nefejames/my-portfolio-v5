import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'

export const dynamic = 'force-dynamic'
import BlogList from '@/components/blog/BlogList'

const description =
  'From my experiments to my personal contemplations and more, this is where I write about anything and everything that I find interesting.'

export const metadata: Metadata = {
  title: 'Blog — Content Strategy, SEO & Technical Writing',
  description,
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    url: '/blog',
    title: 'Blog — Content Strategy, SEO & Technical Writing',
    description,
  },
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 pb-24">
      <div className="mb-12">
        <p className="text-xs font-semibold tracking-widest uppercase text-[var(--accent-text)] mb-4">
          Blog
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-6">
          Tired of the sea of generic, AI-slop content? Then you&apos;re in the right place.
        </h1>
        <p className="text-lg text-[var(--muted)] max-w-xl">
          From my experiments to my personal contemplations and more, this is where I write
          about anything and everything that I find interesting.
        </p>
      </div>

      <BlogList posts={posts} />
    </div>
  )
}
