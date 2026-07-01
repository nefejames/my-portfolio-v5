import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllPosts, getPostBySlug, formatDate } from '@/lib/posts'
import { extractToc } from '@/lib/toc'
import { SITE, absoluteUrl } from '@/lib/site'
import MdxContent from '@/components/blog/MdxContent'
import TableOfContents from '@/components/blog/TableOfContents'
import MobileTableOfContents from '@/components/blog/MobileTableOfContents'
import ScrollProgress from '@/components/blog/ScrollProgress'
import JsonLd from '@/components/JsonLd'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}

  const url = `/blog/${post.slug}`
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.excerpt,
      publishedTime: new Date(post.date).toISOString(),
      authors: [SITE.name],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const toc = extractToc(post.content)

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    keywords: post.tags.join(', '),
    image: absoluteUrl(`/blog/${post.slug}/opengraph-image`),
    url: absoluteUrl(`/blog/${post.slug}`),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(`/blog/${post.slug}`),
    },
    author: { '@type': 'Person', name: SITE.name, url: SITE.url },
    publisher: { '@type': 'Person', name: SITE.name, url: SITE.url },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: absoluteUrl('/blog') },
      { '@type': 'ListItem', position: 3, name: post.title, item: absoluteUrl(`/blog/${post.slug}`) },
    ],
  }

  return (
    <>
      <JsonLd data={[articleSchema, breadcrumbSchema]} />
      <ScrollProgress />

      <div className="max-w-5xl mx-auto px-6 pt-32 pb-24">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--accent-text)] transition-colors mb-12"
        >
          ← Back to blog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-12 items-start">
          {/* Article */}
          <div>
            <header className="mb-12">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium px-2.5 py-1 bg-[var(--accent-subtle)] text-[var(--accent-text)] rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--text)] leading-tight mb-4">
                {post.title}
              </h1>
              <time className="text-sm text-[var(--muted)]">{formatDate(post.date)}</time>
            </header>

            <MobileTableOfContents items={toc} />

            <article className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:text-[var(--text)] prose-headings:scroll-mt-24 prose-a:text-[var(--accent-text)] prose-a:no-underline hover:prose-a:underline prose-code:text-[var(--accent-text)] prose-code:bg-[var(--accent-subtle)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-img:rounded-xl">
              <MdxContent content={post.content} />
            </article>

            <footer className="mt-16 pt-8 border-t border-[var(--border)]">
              <p className="text-sm text-[var(--muted)] mb-4">Written by Emadamerho-Atori Nefe</p>
              <div className="flex gap-4">
                <a
                  href="mailto:nefejames1@gmail.com"
                  className="text-sm font-medium text-[var(--accent-text)] hover:text-[var(--accent-text)] transition-colors"
                >
                  Get in touch
                </a>
                <Link
                  href="/blog"
                  className="text-sm font-medium text-[var(--muted)] hover:text-[var(--text)] transition-colors"
                >
                  More posts
                </Link>
              </div>
            </footer>
          </div>

          {/* Sticky TOC sidebar */}
          {toc.length > 0 && (
            <aside className="hidden lg:block sticky top-28 self-start">
              <TableOfContents items={toc} />
            </aside>
          )}
        </div>
      </div>
    </>
  )
}
