'use client'

import { useState } from 'react'

// Copies the raw prompt text (passed as a prop from the server page) to the
// clipboard and shows a 2s "Copied!" confirmation. Mirrors the copy interaction
// in components/blog/CodeBlock.tsx, including the insecure-context fallback.
export default function CopyPromptButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      try {
        document.execCommand('copy')
      } finally {
        ta.remove()
      }
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? 'Copied' : 'Copy prompt'}
      className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
    >
      {copied ? (
        <>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2.5 8.5 6 12l7.5-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M10.5 5.5v-2a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2" stroke="currentColor" strokeWidth="1.3" />
          </svg>
          Copy prompt
        </>
      )}
    </button>
  )
}
