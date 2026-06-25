'use client'

import type { TocItem } from '@/lib/toc'
import { useActiveHeading } from './useActiveHeading'

export default function TableOfContents({ items }: { items: TocItem[] }) {
  const activeId = useActiveHeading(items)

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
