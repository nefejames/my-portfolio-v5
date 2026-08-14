import Link from 'next/link'

export default function Hero() {
  return (
    <section className="pt-16 min-h-[calc(100vh-160px)] flex flex-col justify-center">
      <div className="max-w-5xl mx-auto px-6 py-10 md:text-center">
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[var(--accent-text)] mb-4">
          Content Marketer &amp; SEO+GEO Manager &amp; Technical Writer
        </span>

        <h1 className="text-5xl md:text-7xl font-bold text-[var(--text)] leading-[1.05] tracking-tight mb-6">
          Emadamerho-<br className="md:hidden" />Atori Nefe
        </h1>

        <p className="text-xl md:text-2xl text-[var(--muted)] leading-relaxed max-w-2xl mb-8 md:mx-auto">
          I create (B2B + B2C) content that readers love, drives conversions, earns top rankings, and builds
          authority.
        </p>

        <div className="flex flex-wrap gap-4 md:justify-center">
          <Link
            href="/portfolio"
            className="px-6 py-3 bg-[var(--accent)] text-white text-sm font-medium rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
          >
            See my portfolio
          </Link>
          <Link
            href="/blog"
            className="px-6 py-3 border border-[var(--border)] text-[var(--text)] text-sm font-medium rounded-lg hover:border-[var(--accent-text)] hover:text-[var(--accent-text)] transition-colors"
          >
            Read my blog
          </Link>
        </div>
      </div>
    </section>
  )
}
