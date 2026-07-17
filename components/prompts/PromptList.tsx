'use client'

import { useState, useMemo } from 'react'
import type { PromptMeta } from '@/lib/prompts'
import PromptCard from './PromptCard'

// Client-side filterable prompt grid. Mirrors components/blog/BlogList.tsx:
// category chips are derived from whatever categories exist (case-insensitive,
// so "Blog" and "blog" are one chip), plus a search box. No server round trips.
const ALL = 'All'

export default function PromptList({ prompts }: { prompts: PromptMeta[] }) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(ALL)

  // Category chips, deduped case-insensitively with first-seen casing as the
  // label (prompts come newest-first, matching the blog's category behaviour).
  const categories = useMemo(() => {
    const byKey = new Map<string, string>()
    for (const p of [...prompts].reverse()) {
      const key = p.category.trim().toLowerCase()
      if (key && !byKey.has(key)) byKey.set(key, p.category.trim())
    }
    return [ALL, ...Array.from(byKey.values()).sort()]
  }, [prompts])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    const cat = activeCategory.toLowerCase()
    return prompts.filter((p) => {
      const matchesCategory = activeCategory === ALL || p.category.toLowerCase() === cat
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [prompts, query, activeCategory])

  return (
    <div>
      {/* Search */}
      <div className="relative mb-6">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--faint)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search prompts…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text)] placeholder-[var(--faint)] focus:outline-none focus:border-[var(--accent-text)] focus:ring-1 focus:ring-[var(--accent-text)] transition-colors"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-sm font-medium px-4 py-1.5 rounded-full border transition-colors ${
              activeCategory === cat
                ? 'bg-[var(--accent)] text-white border-[var(--accent-text)]'
                : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent-text)] hover:text-[var(--accent-text)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[var(--muted)] text-sm">
            {prompts.length === 0
              ? 'No prompts yet — check back soon.'
              : 'No prompts match your search.'}
          </p>
          {prompts.length > 0 && (
            <button
              onClick={() => { setQuery(''); setActiveCategory(ALL) }}
              className="mt-4 text-sm text-[var(--accent-text)] hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((prompt) => (
            <PromptCard key={prompt.slug} prompt={prompt} />
          ))}
        </div>
      )}
    </div>
  )
}
