'use client'

import { useState, useMemo } from 'react'
import type { PostMeta } from '@/lib/posts'
import BlogCard from './BlogCard'

const ALL = 'All'

export default function BlogList({ posts }: { posts: PostMeta[] }) {
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState(ALL)

  const tags = useMemo(() => {
    const set = new Set<string>()
    posts.forEach((p) => p.tags.forEach((t) => set.add(t)))
    return [ALL, ...Array.from(set).sort()]
  }, [posts])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return posts.filter((p) => {
      const matchesTag = activeTag === ALL || p.tags.includes(activeTag)
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      return matchesTag && matchesQuery
    })
  }, [posts, query, activeTag])

  return (
    <div>
      {/* Search */}
      <div className="relative mb-6">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search posts…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-[#E5E7EB] rounded-lg bg-white text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-colors"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-10">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`text-sm font-medium px-4 py-1.5 rounded-full border transition-colors ${
              activeTag === tag
                ? 'bg-[#4F46E5] text-white border-[#4F46E5]'
                : 'border-[#E5E7EB] text-[#6B7280] hover:border-[#4F46E5] hover:text-[#4F46E5]'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[#6B7280] text-sm">No posts match your search.</p>
          <button
            onClick={() => { setQuery(''); setActiveTag(ALL) }}
            className="mt-4 text-sm text-[#4F46E5] hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
