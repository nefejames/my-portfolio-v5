import Link from 'next/link'
import WritingAnimation from '@/components/hero/WritingAnimation'

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-16">
      <div className="max-w-5xl mx-auto px-6 py-24">
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[var(--accent-text)] mb-6">
          Content Marketer &amp; SEO Manager
        </span>

        <h1 className="text-5xl md:text-7xl font-bold text-[var(--text)] leading-[1.05] tracking-tight mb-8">
          <WritingAnimation />
        </h1>

        <p className="text-xl md:text-2xl text-[var(--muted)] leading-relaxed max-w-2xl mb-12">
          I write technical content that ranks, reads well, and drives real
          results — for audiences that range from developers to decision-makers.
        </p>

        <div className="flex flex-wrap gap-4">
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
