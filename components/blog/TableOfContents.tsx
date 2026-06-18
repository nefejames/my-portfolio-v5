'use client'

import { useEffect, useState } from 'react'
import type { TocItem } from '@/lib/toc'

export default function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (items.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0% -70% 0%' }
    )

    items.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  return (
    <nav aria-label="Table of contents">
      <p className="text-xs font-semibold tracking-widest uppercase text-[#6B7280] mb-4">
        On this page
      </p>
      <ul className="flex flex-col gap-1">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: item.level === 3 ? '12px' : '0' }}>
            <a
              href={`#${item.id}`}
              className={`block text-sm py-1 transition-colors leading-snug ${
                activeId === item.id
                  ? 'text-[#4F46E5] font-medium'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
