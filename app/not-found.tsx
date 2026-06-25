import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
}

// Inline SVG can't read CSS vars in presentation attributes, so the bright
// indigo (matches --accent-text) is set directly for visibility on the dark bg.
const GLYPH = '#818CF8'

// A "4" drawn with rounded strokes in the site accent.
function Four() {
  return (
    <svg viewBox="0 0 120 168" className="h-28 md:h-40 w-auto" fill="none" aria-hidden="true">
      <path
        d="M80 18 L20 108 L106 108 M80 18 L80 152"
        stroke={GLYPH}
        strokeWidth="20"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// A "0" that doubles as a slightly startled little character.
function ZeroFace() {
  return (
    <svg viewBox="0 0 140 168" className="h-28 md:h-40 w-auto" aria-hidden="true">
      <rect x="14" y="18" width="112" height="134" rx="56" fill="none" stroke={GLYPH} strokeWidth="20" />
      {/* eyes */}
      <circle cx="52" cy="80" r="16" fill="#FFFFFF" stroke={GLYPH} strokeWidth="3" />
      <circle cx="88" cy="80" r="16" fill="#FFFFFF" stroke={GLYPH} strokeWidth="3" />
      <circle className="nf-pupil" cx="52" cy="82" r="7" fill="#111827" />
      <circle className="nf-pupil" cx="88" cy="82" r="7" fill="#111827" />
      {/* surprised mouth */}
      <ellipse cx="70" cy="120" rx="9" ry="11" fill={GLYPH} />
    </svg>
  )
}

export default function NotFound() {
  return (
    <section className="min-h-[72vh] flex flex-col items-center justify-center text-center px-6 py-24">
      <div className="flex items-center justify-center gap-3 md:gap-5 mb-10">
        <span className="nf-glyph">
          <Four />
        </span>
        <span className="nf-glyph nf-glyph-2">
          <ZeroFace />
        </span>
        <span className="nf-glyph nf-glyph-3">
          <Four />
        </span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-[var(--text)] mb-4">
        This page wandered off
      </h1>
      <p className="text-lg text-[var(--muted)] max-w-md mb-10 leading-relaxed">
        The page you’re looking for doesn’t exist or may have moved. Let’s get
        you back on track.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-[var(--accent)] text-white text-sm font-medium rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
        >
          Back home
        </Link>
        <Link
          href="/portfolio"
          className="px-6 py-3 border border-[var(--border)] text-[var(--text)] text-sm font-medium rounded-lg hover:border-[var(--accent-text)] hover:text-[var(--accent-text)] transition-colors"
        >
          Browse my portfolio
        </Link>
      </div>
    </section>
  )
}
