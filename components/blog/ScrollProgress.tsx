'use client'

import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handler = () => {
      const el = document.documentElement
      const scrollable = el.scrollHeight - el.clientHeight
      if (scrollable === 0) return
      setProgress((el.scrollTop / scrollable) * 100)
    }
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <div className="fixed top-16 left-0 right-0 z-40 h-0.5 bg-[#E5E7EB]">
      <div
        className="h-full bg-[#4F46E5]"
        style={{ width: `${progress}%`, transition: 'width 60ms linear' }}
      />
    </div>
  )
}
