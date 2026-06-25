import Link from 'next/link'
import Image from 'next/image'
import type { PortfolioMeta } from '@/lib/portfolio'
import { formatDate } from '@/lib/utils'

export default function PortfolioCard({ article }: { article: PortfolioMeta }) {
  return (
    <Link
      href={`/portfolio/${article.clientSlug}/${article.slug}`}
      className="group flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--accent-text)] hover:shadow-sm transition-all"
    >
      {article.coverImage && (
        <div className="relative aspect-[16/9] bg-[var(--surface-2)] overflow-hidden">
          <Image
            src={article.coverImage}
            alt=""
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="flex flex-col gap-3 p-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[var(--accent-text)]">{article.client}</span>
          <time className="text-xs text-[var(--muted)]">{formatDate(article.publishedAt)}</time>
        </div>
        <h2 className="text-base font-semibold text-[var(--text)] group-hover:text-[var(--accent-text)] transition-colors leading-snug">
          {article.title}
        </h2>
        <p className="text-sm text-[var(--muted)] leading-relaxed">{article.excerpt}</p>
        <span className="text-xs font-medium text-[var(--accent-text)] mt-auto pt-2">Read article →</span>
      </div>
    </Link>
  )
}
