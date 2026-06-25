import Link from 'next/link'

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-16">
      <div className="max-w-5xl mx-auto px-6 py-24">
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#4F46E5] mb-6">
          Content Marketer &amp; SEO Manager
        </span>

        <h1 className="text-5xl md:text-7xl font-bold text-[#111827] leading-[1.05] tracking-tight mb-8">
          Emadamerho-
          <br />
          Atori Nefe
        </h1>

        <p className="text-xl md:text-2xl text-[#6B7280] leading-relaxed max-w-2xl mb-12">
          I write technical content that ranks, reads well, and drives real
          results — for audiences that range from developers to decision-makers.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/portfolio"
            className="px-6 py-3 bg-[#4F46E5] text-white text-sm font-medium rounded-lg hover:bg-[#4338CA] transition-colors"
          >
            See my work
          </Link>
          <Link
            href="/blog"
            className="px-6 py-3 border border-[#E5E7EB] text-[#111827] text-sm font-medium rounded-lg hover:border-[#4F46E5] hover:text-[#4F46E5] transition-colors"
          >
            Read the blog
          </Link>
        </div>
      </div>
    </section>
  )
}
