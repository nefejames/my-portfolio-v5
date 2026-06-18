import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllPosts, getPostBySlug, formatDate } from '@/lib/posts'
import { mdxComponents } from '@/components/blog/MdxComponents'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  return (
    <div className="max-w-2xl mx-auto px-6 pt-32 pb-24">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#4F46E5] transition-colors mb-12"
      >
        ← Back to blog
      </Link>

      <header className="mb-12">
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium px-2.5 py-1 bg-[#EEF2FF] text-[#4F46E5] rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#111827] leading-tight mb-4">
          {post.title}
        </h1>
        <time className="text-sm text-[#6B7280]">{formatDate(post.date)}</time>
      </header>

      <article className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-[#111827] prose-a:text-[#4F46E5] prose-a:no-underline hover:prose-a:underline prose-code:text-[#4F46E5] prose-code:bg-[#EEF2FF] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
        <MDXRemote source={post.content} components={mdxComponents} />
      </article>

      <footer className="mt-16 pt-8 border-t border-[#E5E7EB]">
        <p className="text-sm text-[#6B7280] mb-4">Written by Emadamerho-Atori Nefe</p>
        <div className="flex gap-4">
          <a
            href="mailto:nefejames1@gmail.com"
            className="text-sm font-medium text-[#4F46E5] hover:text-[#4338CA] transition-colors"
          >
            Get in touch
          </a>
          <Link
            href="/blog"
            className="text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors"
          >
            More posts
          </Link>
        </div>
      </footer>
    </div>
  )
}
