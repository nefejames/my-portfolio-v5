'use client'

import { useEffect, useRef } from 'react'

// Reading progress bar. Writes transform directly to the DOM node inside a
// requestAnimationFrame — no setState, so scrolling never re-renders React,
// and scaleX stays on the compositor (width would trigger layout every frame).
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const el = document.documentElement
      const scrollable = el.scrollHeight - el.clientHeight
      if (scrollable <= 0 || !barRef.current) return
      barRef.current.style.transform = `scaleX(${el.scrollTop / scrollable})`
    }

    const onScroll = () => {
      // Coalesce bursts of scroll events into one style write per frame.
      if (!frame) frame = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="fixed top-16 left-0 right-0 z-40 h-0.5 bg-[var(--border)]">
      <div
        ref={barRef}
        className="h-full bg-[var(--accent)] origin-left"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  )
}
