import Link from 'next/link'
import type { ReactNode } from 'react'
import type { TocItem } from '@/lib/toc'
import { SITE } from '@/lib/site'
import { formatDate } from '@/lib/utils'
import TableOfContents from '@/components/blog/TableOfContents'
import MobileTableOfContents from '@/components/blog/MobileTableOfContents'
import ScrollProgress from '@/components/blog/ScrollProgress'

// ─── Shared article shell ─────────────────────────────────────────────────────
// One layout for blog posts (/blog/[slug]) and portfolio articles
// (/portfolio/[client]/[slug]): progress bar, back link, header, mobile +
// sidebar TOCs, prose styling, and footer. Pages keep what's genuinely theirs —
// metadata, JSON-LD, and route-specific header extras (attribution banner).

// Single source of truth for article typography. Both routes previously
// duplicated this string; a divergence here silently forked the reading
// experience between blog and portfolio.
const PROSE_CLASSES =
  'prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:text-[var(--text)] prose-headings:scroll-mt-24 prose-a:text-[var(--accent-text)] prose-a:no-underline hover:prose-a:underline prose-code:text-[var(--accent-text)] prose-code:bg-[var(--accent-subtle)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-img:rounded-xl'

type Props = {
  backHref: string
  backLabel: string
  title: string
  /** ISO date string; rendered with the shared formatDate. */
  date: string
  tags: string[]
  toc: TocItem[]
  /** Route-specific header content below the date, e.g. the portfolio
   *  "Originally published for …" attribution banner. */
  headerExtra?: ReactNode
  /** Footer byline, e.g. "Written by … for AltexSoft". */
  byline: string
  moreHref: string
  moreLabel: string
  /** The rendered article body (an <MdxContent /> element). */
  children: ReactNode
}

export default function ArticleLayout({
  backHref,
  backLabel,
  title,
  date,
  tags,
  toc,
  headerExtra,
  byline,
  moreHref,
  moreLabel,
  children,
}: Props) {
  return (
    <>
      <ScrollProgress />

      <div className="max-w-5xl mx-auto px-6 pt-32 pb-24">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--accent-text)] transition-colors mb-12"
        >
          ← {backLabel}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-12 items-start">
          {/* Article */}
          <div>
            <header className="mb-12">
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium px-2.5 py-1 bg-[var(--accent-subtle)] text-[var(--accent-text)] rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--text)] leading-tight mb-4">
                {title}
              </h1>
              <time className="text-sm text-[var(--muted)]">{formatDate(date)}</time>
              {headerExtra}
            </header>

            <MobileTableOfContents items={toc} />

            <article className={PROSE_CLASSES}>{children}</article>

            <footer className="mt-16 pt-8 border-t border-[var(--border)]">
              <p className="text-sm text-[var(--muted)] mb-4">{byline}</p>
              <div className="flex gap-4">
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-sm font-medium text-[var(--accent-text)] hover:text-[var(--accent-text)] transition-colors"
                >
                  Get in touch
                </a>
                <Link
                  href={moreHref}
                  className="text-sm font-medium text-[var(--muted)] hover:text-[var(--text)] transition-colors"
                >
                  {moreLabel}
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
