import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-[var(--muted)]">
          © {new Date().getFullYear()} Emadamerho-Atori Nefe. All rights reserved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Link
            href="/"
            className="text-sm text-[var(--muted)] hover:text-[var(--accent-text)] transition-colors"
          >
            Home
          </Link>
          <Link
            href="/blog"
            className="text-sm text-[var(--muted)] hover:text-[var(--accent-text)] transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/portfolio"
            className="text-sm text-[var(--muted)] hover:text-[var(--accent-text)] transition-colors"
          >
            Portfolio
          </Link>
          <a
            href="mailto:nefejames1@gmail.com"
            className="text-sm text-[var(--muted)] hover:text-[var(--accent-text)] transition-colors"
          >
            Email
          </a>
          <a
            href="https://linkedin.com/in/nefe-emadamerho-atori"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--muted)] hover:text-[var(--accent-text)] transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  )
}
