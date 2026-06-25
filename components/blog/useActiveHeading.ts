'use client'

import { useEffect, useState } from 'react'
import type { TocItem } from '@/lib/toc'

// Scroll-spy: returns the id of the heading currently in view, so the table of
// contents can highlight the section the reader is in. Shared by the desktop
// sidebar TOC and the mobile collapsible TOC.
export function useActiveHeading(items: TocItem[]): string {
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
      { rootMargin: '-80px 0% -70% 0%' },
    )

    items.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [items])

  return activeId
}
