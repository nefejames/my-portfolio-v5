import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  getAllPortfolioArticles,
  getPortfolioArticle,
  formatDate,
} from '@/lib/portfolio'
import { extractToc } from '@/lib/toc'
import { SITE, absoluteUrl } from '@/lib/site'
import MdxContent from '@/components/blog/MdxContent'
import ArticleLayout from '@/components/ArticleLayout'
import JsonLd from '@/components/JsonLd'

type Props = { params: Promise<{ client: string; slug: string }> }

export async function generateStaticParams() {
  const articles = await getAllPortfolioArticles()
  return articles.map((a) => ({ client: a.clientSlug, slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { client, slug } = await params
  const article = await getPortfolioArticle(client, slug)
  if (!article) return {}
  return {
    title: article.title,
    description: article.excerpt,
    // Tells search engines the original publication is the authoritative copy.
    // Portfolio articles only — personal blog posts don't set this.
    alternates: { canonical: article.canonical },
    openGraph: {
      type: 'article',
      // OG url points at the authoritative original, matching the canonical.
      url: article.canonical,
      title: article.title,
      description: article.excerpt,
      publishedTime: new Date(article.publishedAt).toISOString(),
      authors: [SITE.name],
      tags: article.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
    },
  }
}

export default async function PortfolioArticlePage({ params }: Props) {
  const { client, slug } = await params
  const article = await getPortfolioArticle(client, slug)
  if (!article) notFound()

  const toc = extractToc(article.content)

  const pageUrl = absoluteUrl(`/portfolio/${article.clientSlug}/${article.slug}`)
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: new Date(article.publishedAt).toISOString(),
    keywords: article.tags.join(', '),
    image: absoluteUrl(`/portfolio/${article.clientSlug}/${article.slug}/opengraph-image`),
    // Canonical original is the authoritative copy this republication is based on.
    url: article.canonical,
    mainEntityOfPage: { '@type': 'WebPage', '@id': article.canonical },
    isBasedOn: article.originalUrl,
    author: { '@type': 'Person', name: SITE.name, url: SITE.url },
    publisher: { '@type': 'Organization', name: article.client },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
      { '@type': 'ListItem', position: 2, name: 'Portfolio', item: absoluteUrl('/portfolio') },
      { '@type': 'ListItem', position: 3, name: article.title, item: pageUrl },
    ],
  }

  return (
    <>
      <JsonLd data={[articleSchema, breadcrumbSchema]} />
      <ArticleLayout
        backHref="/portfolio"
        backLabel="Back to portfolio"
        title={article.title}
        date={article.publishedAt}
        tags={article.tags}
        toc={toc}
        byline={`Written by ${SITE.name} for ${article.client}`}
        moreHref="/portfolio"
        moreLabel="More articles"
        headerExtra={
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 px-4 py-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl">
            <p className="text-sm text-[var(--muted)]">
              Originally published for{' '}
              <span className="font-medium text-[var(--text)]">{article.client}</span> on{' '}
              {formatDate(article.publishedAt)}
            </p>
            <a
              href={article.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[var(--accent-text)] hover:text-[var(--accent-text)] transition-colors sm:ml-auto"
            >
              View original article →
            </a>
          </div>
        }
      >
        <MdxContent content={article.content} />
      </ArticleLayout>
    </>
  )
}
