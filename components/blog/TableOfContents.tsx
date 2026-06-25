'use client'

import type { TocItem } from '@/lib/toc'
import { useActiveHeading } from './useActiveHeading'

export default function TableOfContents({ items }: { items: TocItem[] }) {
  const activeId = useActiveHeading(items)

  if (items.length === 0) return null

  return (
    <nav aria-label="Table of contents">
      <p className="text-xs font-semibold tracking-widest uppercase text-[var(--muted)] mb-4">
        On this page
      </p>
      <ul className="flex flex-col gap-1">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: item.level === 3 ? '12px' : '0' }}>
            <a
              href={`#${item.id}`}
              className={`block text-sm py-1 transition-colors leading-snug ${
                activeId === item.id
                  ? 'text-[var(--accent-text)] font-medium'
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
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
