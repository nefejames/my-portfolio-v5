'use client'

import { useEffect, useRef } from 'react'
import mediumZoom from 'medium-zoom'
import type { ReactNode } from 'react'

export default function ZoomImage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const imgs = ref.current?.querySelectorAll('img')
    if (!imgs?.length) return
    const zoom = mediumZoom(imgs, {
      background: 'rgba(0, 0, 0, 0.85)',
      margin: 8,
    })
    return () => { zoom.detach() }
  }, [])

  return <div ref={ref}>{children}</div>
}
