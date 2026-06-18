const services = [
  {
    title: 'Technical Writing',
    description:
      'Blog posts, tutorials, how-to guides, and documentation for developer tools and technical products. I make complex concepts accessible without losing accuracy.',
    tags: ['API Docs', 'Tutorials', 'How-to Guides', 'Case Studies'],
  },
  {
    title: 'SEO Strategy',
    description:
      'Keyword research, on-page optimization, and content audits that move the needle on organic traffic. I use Ahrefs, SEMrush, Clearscope, and Frase.io.',
    tags: ['Keyword Research', 'On-page SEO', 'Content Audits', 'Performance Tracking'],
  },
  {
    title: 'Content Campaigns',
    description:
      'Social media, email newsletters, landing page copy, and gated content that converts. I have run campaigns across LinkedIn, Twitter/X, and email at scale.',
    tags: ['Email Marketing', 'Social Media', 'Landing Pages', 'Ad Copy'],
  },
]

export default function Services() {
  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#4F46E5] mb-4">
          What I do
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-16">
          Content across the full funnel
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {services.map((s) => (
            <div key={s.title} className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-[#111827]">{s.title}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">{s.description}</p>
              <div className="flex flex-wrap gap-2 mt-auto pt-4">
                {s.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium px-2.5 py-1 bg-[#EEF2FF] text-[#4F46E5] rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
