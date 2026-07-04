import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/posts'
import { extractToc } from '@/lib/toc'
import { SITE, absoluteUrl } from '@/lib/site'
import MdxContent from '@/components/blog/MdxContent'
import ArticleLayout from '@/components/ArticleLayout'
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
      <ArticleLayout
        backHref="/blog"
        backLabel="Back to blog"
        title={post.title}
        date={post.date}
        tags={post.tags}
        toc={toc}
        byline={`Written by ${SITE.name}`}
        moreHref="/blog"
        moreLabel="More posts"
      >
        <MdxContent content={post.content} />
      </ArticleLayout>
    </>
  )
}
