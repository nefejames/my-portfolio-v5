'use client'

import { useState, useMemo } from 'react'
import posthog from 'posthog-js'
import type { PortfolioCardData } from '@/lib/portfolio'
import PortfolioCard from './PortfolioCard'

const ALL = 'All'
// Render an initial slice and reveal more on demand, so the archive (135+
// articles, each with a next/image thumbnail) doesn't mount all at once.
const PAGE_SIZE = 24
type SortOrder = 'newest' | 'oldest'

type Client = { slug: string; name: string; logo?: string | null }

export default function PortfolioList({
  articles,
  clients,
}: {
  articles: PortfolioCardData[]
  clients: Client[]
}) {
  const [activeClient, setActiveClient] = useState(ALL)
  const [sort, setSort] = useState<SortOrder>('newest')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const filtered = useMemo(() => {
    const list = articles.filter(
      (a) => activeClient === ALL || a.clientSlug === activeClient,
    )
    return [...list].sort((a, b) => {
      const diff = new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      return sort === 'newest' ? -diff : diff
    })
  }, [articles, activeClient, sort])

  const visible = filtered.slice(0, visibleCount)

  return (
    <div>
      {/* Client filters + sort */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div className="flex flex-wrap items-center gap-2">
          {[{ slug: ALL, name: ALL, logo: null } as Client, ...clients].map((client) => {
            const active = activeClient === client.slug
            return (
              <button
                key={client.slug}
                onClick={() => {
                  setActiveClient(client.slug)
                  setVisibleCount(PAGE_SIZE)
                  posthog.capture('portfolio_filtered', { filter_type: 'client', filter_value: client.slug })
                }}
                aria-pressed={active}
                aria-label={client.name}
                className={`flex items-center px-4 py-1.5 rounded-full border transition-all ${
                  active
                    ? 'border-[var(--accent-text)] bg-[var(--surface)]'
                    : 'border-[var(--border)] hover:border-[var(--accent-text)]'
                }`}
              >
                {client.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={client.logo}
                    alt={client.name}
                    className={`h-5 w-auto object-contain transition-opacity ${
                      active ? 'opacity-100' : 'opacity-70'
                    }`}
                  />
                ) : (
                  <span
                    className={`text-sm font-medium ${
                      active ? 'text-[var(--accent-text)]' : 'text-[var(--muted)]'
                    }`}
                  >
                    {client.name}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          {(['newest', 'oldest'] as const).map((order) => (
            <button
              key={order}
              onClick={() => {
                setSort(order)
                setVisibleCount(PAGE_SIZE)
                posthog.capture('portfolio_filtered', { filter_type: 'sort', filter_value: order })
              }}
              className={`text-sm font-medium px-4 py-1.5 rounded-full border transition-colors ${
                sort === order
                  ? 'bg-[var(--accent)] text-white border-[var(--accent-text)]'
                  : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent-text)] hover:text-[var(--accent-text)]'
              }`}
            >
              {order === 'newest' ? 'Newest first' : 'Oldest first'}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[var(--muted)] text-sm">No articles yet for this client.</p>
          {activeClient !== ALL && (
            <button
              onClick={() => setActiveClient(ALL)}
              className="mt-4 text-sm text-[var(--accent-text)] hover:underline"
            >
              Show all clients
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((article) => (
              <PortfolioCard key={`${article.clientSlug}/${article.slug}`} article={article} />
            ))}
          </div>

          {visibleCount < filtered.length && (
            <div className="mt-12 flex flex-col items-center gap-3">
              <p className="text-sm text-[var(--muted)]">
                Showing {visible.length} of {filtered.length}
              </p>
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="px-6 py-2.5 text-sm font-medium border border-[var(--border)] text-[var(--text)] rounded-lg hover:border-[var(--accent-text)] hover:text-[var(--accent-text)] transition-colors"
              >
                Load more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
