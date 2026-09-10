'use client'

import { useEffect, useRef, useState } from 'react'
import type { PostMeta } from '@/lib/posts'

interface ComingSoonModalProps {
  post: PostMeta
  onClose: () => void
  intro?: string
  ctaLabel?: string
  successMessage?: string
}

export default function ComingSoonModal({
  post,
  onClose,
  intro = "I'm currently drafting this. Please be patient. Since you're so curious, here's what this article will cover:",
  ctaLabel = 'Get notified when it drops',
  successMessage = "You're on the list. I'll let you know the moment it's live.",
}: ComingSoonModalProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/notify-me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          articleTitle: post.title,
          articleSlug: post.slug,
        }),
      })
      if (!res.ok) throw new Error('request failed')
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again.')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="csm-title"
        className="relative w-full max-w-lg bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 shadow-2xl"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-1 text-[var(--muted)] hover:text-[var(--text)] transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[var(--accent-text)] bg-[var(--accent-subtle)] px-3 py-1 rounded-full mb-5">
          Coming soon
        </span>

        <h2 id="csm-title" className="text-xl font-bold text-[var(--text)] mb-4 leading-snug">
          {post.title}
        </h2>

        <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">{intro}</p>

        {post.previewBullets.length > 0 && (
          <ul className="space-y-2 mb-6">
            {post.previewBullets.map((bullet, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-[var(--muted)]">
                <span className="text-[var(--accent-text)] shrink-0 mt-0.5">→</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        )}

        {status === 'success' ? (
          <p className="text-sm font-medium text-[var(--accent-text)]">{successMessage}</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-2">
            <input
              ref={inputRef}
              type="email"
              required
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
              className="w-full px-4 py-2.5 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] placeholder-[var(--faint)] focus:outline-none focus:border-[var(--accent-text)] focus:ring-1 focus:ring-[var(--accent-text)] transition-colors disabled:opacity-60"
            />
            {errorMsg && (
              <p className="text-xs text-red-500">{errorMsg}</p>
            )}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-2.5 bg-[var(--accent)] text-white text-sm font-medium rounded-lg hover:bg-[var(--accent-hover)] disabled:opacity-60 transition-colors"
            >
              {status === 'loading' ? 'Submitting...' : ctaLabel}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
