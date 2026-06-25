'use client'

import { useState } from 'react'
import type { TocItem } from '@/lib/toc'
import { useActiveHeading } from './useActiveHeading'

// Mobile-only collapsible table of contents. The desktop TOC lives in a sticky
// sidebar that's hidden below `lg`; this gives small screens a togglable version
// with the same scroll-spy highlighting. Tapping a link scrolls to the section
// (native anchor + smooth scroll) and closes the panel.
export default function MobileTableOfContents({ items }: { items: TocItem[] }) {
  const activeId = useActiveHeading(items)
  const [open, setOpen] = useState(false)

  if (items.length === 0) return null

  return (
    <nav
      aria-label="Table of contents"
      className="lg:hidden mb-10 border border-[var(--border)] rounded-xl bg-[var(--surface-2)] overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold tracking-widest uppercase text-[var(--muted)]"
      >
        On this page
        <svg
          className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul className="flex flex-col gap-1 px-4 pb-4">
          {items.map((item) => (
            <li key={item.id} style={{ paddingLeft: item.level === 3 ? '12px' : '0' }}>
              <a
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
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
      )}
    </nav>
  )
}
