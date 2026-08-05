import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import type { PostMeta } from '@/lib/posts'
import type { PortfolioMeta } from '@/lib/portfolio'

type RelatedItem =
  | { type: 'post'; data: PostMeta }
  | { type: 'portfolio'; data: PortfolioMeta }

export default function RelatedArticles({ items }: { items: RelatedItem[] }) {
  if (items.length === 0) return null

  return (
    <section className="mt-16 pt-8 border-t border-[var(--border)]">
      <p className="text-xs font-semibold tracking-widest uppercase text-[var(--muted)] mb-6">
        Related reading
      </p>
      <div className="flex flex-col gap-3">
        {items.map((item) => {
          const href =
            item.type === 'post'
              ? `/blog/${item.data.slug}`
              : `/portfolio/${item.data.clientSlug}/${item.data.slug}`
          const date = item.type === 'post' ? item.data.date : item.data.publishedAt
          const label = item.type === 'portfolio' ? item.data.client : null

          return (
            <Link
              key={href}
              href={href}
              className="group flex flex-col gap-1 p-4 rounded-xl border border-[var(--border)] hover:border-[var(--accent-text)] transition-colors"
            >
              {label && (
                <span className="text-xs font-medium text-[var(--accent-text)]">{label}</span>
              )}
              <span className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent-text)] transition-colors leading-snug">
                {item.data.title}
              </span>
              <span className="text-xs text-[var(--muted)]">{formatDate(date)}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
