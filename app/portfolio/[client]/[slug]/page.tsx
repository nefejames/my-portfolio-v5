import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  getAllPortfolioArticles,
  getPortfolioArticle,
  formatDate,
} from '@/lib/portfolio'
import { extractToc } from '@/lib/toc'
import MdxContent from '@/components/blog/MdxContent'
import TableOfContents from '@/components/blog/TableOfContents'
import MobileTableOfContents from '@/components/blog/MobileTableOfContents'
import ScrollProgress from '@/components/blog/ScrollProgress'

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
  }
}

export default async function PortfolioArticlePage({ params }: Props) {
  const { client, slug } = await params
  const article = await getPortfolioArticle(client, slug)
  if (!article) notFound()

  const toc = extractToc(article.content)

  return (
    <>
      <ScrollProgress />

      <div className="max-w-5xl mx-auto px-6 pt-32 pb-24">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#4F46E5] transition-colors mb-12"
        >
          ← Back to portfolio
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-12 items-start">
          {/* Article */}
          <div>
            <header className="mb-12">
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium px-2.5 py-1 bg-[#EEF2FF] text-[#4F46E5] rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#111827] leading-tight mb-4">
                {article.title}
              </h1>
              <time className="text-sm text-[#6B7280]">
                {formatDate(article.publishedAt)}
              </time>

              {/* Attribution banner */}
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl">
                <p className="text-sm text-[#6B7280]">
                  Originally published for{' '}
                  <span className="font-medium text-[#111827]">{article.client}</span>{' '}
                  on {formatDate(article.publishedAt)}
                </p>
                <a
                  href={article.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-[#4F46E5] hover:text-[#4338CA] transition-colors sm:ml-auto"
                >
                  View original article →
                </a>
              </div>
            </header>

            <MobileTableOfContents items={toc} />

            <article className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-[#111827] prose-headings:scroll-mt-24 prose-a:text-[#4F46E5] prose-a:no-underline hover:prose-a:underline prose-code:text-[#4F46E5] prose-code:bg-[#EEF2FF] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-img:rounded-xl">
              <MdxContent content={article.content} />
            </article>

            <footer className="mt-16 pt-8 border-t border-[#E5E7EB]">
              <p className="text-sm text-[#6B7280] mb-4">
                Written by Emadamerho-Atori Nefe for {article.client}
              </p>
              <div className="flex gap-4">
                <a
                  href="mailto:nefejames1@gmail.com"
                  className="text-sm font-medium text-[#4F46E5] hover:text-[#4338CA] transition-colors"
                >
                  Get in touch
                </a>
                <Link
                  href="/portfolio"
                  className="text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors"
                >
                  More articles
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
