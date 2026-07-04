'use client'

import { useRef, useState, type HTMLAttributes } from 'react'

// ─── Code block chrome ────────────────────────────────────────────────────────
// Wraps every fenced code block (mapped to `pre` in MdxComponents) with a
// VS Code-style header: a language icon + name on the left and a click-to-copy
// button on the right. Token colors come from the Shiki theme (github-dark);
// the chrome uses the site's surface/border tokens.

type LangMeta = { label: string; icon: React.ReactNode }

// Compact, recognizable file-type glyphs in their conventional brand colors —
// the same visual language as VS Code's file icons.
function BadgeIcon({ bg, fg, text }: { bg: string; fg: string; text: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <rect width="16" height="16" rx="3" fill={bg} />
      <text
        x="8"
        y="11.5"
        textAnchor="middle"
        fontSize="7.5"
        fontWeight="700"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fill={fg}
      >
        {text}
      </text>
    </svg>
  )
}

function ReactIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="1.6" fill="#61DAFB" />
      <g stroke="#61DAFB" strokeWidth="1" fill="none">
        <ellipse cx="8" cy="8" rx="7" ry="2.8" />
        <ellipse cx="8" cy="8" rx="7" ry="2.8" transform="rotate(60 8 8)" />
        <ellipse cx="8" cy="8" rx="7" ry="2.8" transform="rotate(120 8 8)" />
      </g>
    </svg>
  )
}

function TerminalIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <rect width="16" height="16" rx="3" fill="#4D4D4D" />
      <path d="M4 5.5 6.5 8 4 10.5" stroke="#3DDC84" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 11h4" stroke="#E6E6E6" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function FileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M4 1.5h5L13 5.5v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-12a1 1 0 0 1 1-1Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path d="M9 1.5V5.5H13" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

const LANGS: Record<string, LangMeta> = {
  js: { label: 'JavaScript', icon: <BadgeIcon bg="#F7DF1E" fg="#1E1E1E" text="JS" /> },
  javascript: { label: 'JavaScript', icon: <BadgeIcon bg="#F7DF1E" fg="#1E1E1E" text="JS" /> },
  mjs: { label: 'JavaScript', icon: <BadgeIcon bg="#F7DF1E" fg="#1E1E1E" text="JS" /> },
  ts: { label: 'TypeScript', icon: <BadgeIcon bg="#3178C6" fg="#FFFFFF" text="TS" /> },
  typescript: { label: 'TypeScript', icon: <BadgeIcon bg="#3178C6" fg="#FFFFFF" text="TS" /> },
  jsx: { label: 'JSX', icon: <ReactIcon /> },
  tsx: { label: 'TSX', icon: <ReactIcon /> },
  html: { label: 'HTML', icon: <BadgeIcon bg="#E44D26" fg="#FFFFFF" text="<>" /> },
  css: { label: 'CSS', icon: <BadgeIcon bg="#42A5F5" fg="#FFFFFF" text="#" /> },
  scss: { label: 'SCSS', icon: <BadgeIcon bg="#CD6799" fg="#FFFFFF" text="S" /> },
  json: { label: 'JSON', icon: <BadgeIcon bg="#8B8000" fg="#FFFFFF" text="{}" /> },
  bash: { label: 'Bash', icon: <TerminalIcon /> },
  sh: { label: 'Shell', icon: <TerminalIcon /> },
  shell: { label: 'Shell', icon: <TerminalIcon /> },
  zsh: { label: 'Shell', icon: <TerminalIcon /> },
  py: { label: 'Python', icon: <BadgeIcon bg="#3776AB" fg="#FFD43B" text="Py" /> },
  python: { label: 'Python', icon: <BadgeIcon bg="#3776AB" fg="#FFD43B" text="Py" /> },
  md: { label: 'Markdown', icon: <BadgeIcon bg="#519ABA" fg="#FFFFFF" text="M↓" /> },
  yaml: { label: 'YAML', icon: <BadgeIcon bg="#CB171E" fg="#FFFFFF" text="Y" /> },
  yml: { label: 'YAML', icon: <BadgeIcon bg="#CB171E" fg="#FFFFFF" text="Y" /> },
  sql: { label: 'SQL', icon: <BadgeIcon bg="#336791" fg="#FFFFFF" text="DB" /> },
  graphql: { label: 'GraphQL', icon: <BadgeIcon bg="#E10098" fg="#FFFFFF" text="GQ" /> },
  vue: { label: 'Vue', icon: <BadgeIcon bg="#41B883" fg="#FFFFFF" text="V" /> },
}

export default function CodeBlock({
  children,
  ...props
}: HTMLAttributes<HTMLPreElement> & { 'data-language'?: string }) {
  const preRef = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)

  const rawLang = (props['data-language'] || '').toLowerCase()
  const meta = LANGS[rawLang]
  const label = meta?.label ?? (rawLang && rawLang !== 'plaintext' && rawLang !== 'text' ? rawLang.toUpperCase() : 'Code')

  const copy = async () => {
    const text = preRef.current?.innerText ?? ''
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Fallback for insecure contexts / unfocused documents.
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
    <div className="code-block rounded-xl border border-[var(--border)] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--surface-2)] border-b border-[var(--border)]">
        <span className="flex items-center gap-2 text-xs font-medium text-[var(--muted)]">
          <span className="text-[var(--faint)]">{meta?.icon ?? <FileIcon />}</span>
          {label}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? 'Copied' : 'Copy code'}
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
              Copy
            </>
          )}
        </button>
      </div>
      <pre ref={preRef} {...props}>
        {children}
      </pre>
    </div>
  )
}
