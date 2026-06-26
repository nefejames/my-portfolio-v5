'use client'

import { useState, useMemo } from 'react'
import type { PortfolioMeta } from '@/lib/portfolio'
import PortfolioCard from './PortfolioCard'

const ALL = 'All'
type SortOrder = 'newest' | 'oldest'

type Client = { slug: string; name: string; logo?: string | null }

export default function PortfolioList({
  articles,
  clients,
}: {
  articles: PortfolioMeta[]
  clients: Client[]
}) {
  const [activeClient, setActiveClient] = useState(ALL)
  const [sort, setSort] = useState<SortOrder>('newest')

  const filtered = useMemo(() => {
    const list = articles.filter(
      (a) => activeClient === ALL || a.clientSlug === activeClient,
    )
    return [...list].sort((a, b) => {
      const diff = new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      return sort === 'newest' ? -diff : diff
    })
  }, [articles, activeClient, sort])

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
                onClick={() => setActiveClient(client.slug)}
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
                      active ? 'opacity-100' : 'opacity-60'
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
              onClick={() => setSort(order)}
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
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((article) => (
            <PortfolioCard key={`${article.clientSlug}/${article.slug}`} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}
