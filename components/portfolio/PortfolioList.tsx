'use client'

import { useState, useMemo } from 'react'
import type { PortfolioMeta } from '@/lib/portfolio'
import PortfolioCard from './PortfolioCard'

const ALL = 'All'
type SortOrder = 'newest' | 'oldest'

type Client = { slug: string; name: string }

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
        <div className="flex flex-wrap gap-2">
          {[{ slug: ALL, name: ALL }, ...clients].map((client) => (
            <button
              key={client.slug}
              onClick={() => setActiveClient(client.slug)}
              className={`text-sm font-medium px-4 py-1.5 rounded-full border transition-colors ${
                activeClient === client.slug
                  ? 'bg-[#4F46E5] text-white border-[#4F46E5]'
                  : 'border-[#E5E7EB] text-[#6B7280] hover:border-[#4F46E5] hover:text-[#4F46E5]'
              }`}
            >
              {client.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {(['newest', 'oldest'] as const).map((order) => (
            <button
              key={order}
              onClick={() => setSort(order)}
              className={`text-sm font-medium px-4 py-1.5 rounded-full border transition-colors ${
                sort === order
                  ? 'bg-[#4F46E5] text-white border-[#4F46E5]'
                  : 'border-[#E5E7EB] text-[#6B7280] hover:border-[#4F46E5] hover:text-[#4F46E5]'
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
          <p className="text-[#6B7280] text-sm">No articles yet for this client.</p>
          {activeClient !== ALL && (
            <button
              onClick={() => setActiveClient(ALL)}
              className="mt-4 text-sm text-[#4F46E5] hover:underline"
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
