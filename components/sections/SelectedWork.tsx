// Update href values with real article URLs once confirmed

const work = [
  {
    publication: 'LogRocket',
    title: 'Understanding React Server Components: A Developer Guide',
    description:
      'A deep dive into RSC architecture with code demos and practical examples for production apps.',
    tags: ['Technical Writing', 'React'],
    href: '#',
  },
  {
    publication: 'Prismic',
    title: 'Next.js vs Gatsby: Which Framework Should You Choose?',
    description:
      'A head-to-head comparison helping developers pick the right tool based on project needs.',
    tags: ['Technical Writing', 'Next.js'],
    href: '#',
  },
  {
    publication: 'AltexSoft',
    title: 'What Is API Documentation? Types, Best Practices, and Tools',
    description:
      'Comprehensive guide enriched with diagrams covering API docs standards for technical and non-technical audiences.',
    tags: ['Technical Writing', 'APIs'],
    href: '#',
  },
  {
    publication: 'Dojah',
    title: 'KYC Compliance for Fintech: What You Need to Know in 2024',
    description:
      'Narrative-driven article explaining identity verification regulations, ranking top 10 for target keywords.',
    tags: ['Content Marketing', 'Fintech'],
    href: '#',
  },
  {
    publication: 'Smashing Magazine',
    title: 'CSS Grid vs. Flexbox: When to Use Each',
    description:
      'Practical breakdown for front-end developers on choosing the right layout approach with live code examples.',
    tags: ['Technical Writing', 'CSS'],
    href: '#',
  },
  {
    publication: 'Strapi',
    title: 'Headless CMS Explained: Architecture, Benefits, and Use Cases',
    description:
      'SEO-optimized explainer that drove top-10 rankings and qualified traffic for developer audiences.',
    tags: ['Technical Writing', 'CMS'],
    href: '#',
  },
]

export default function SelectedWork() {
  return (
    <section id="work" className="py-24 bg-[#F9FAFB]">
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#4F46E5] mb-4">
          Selected work
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-16">
          Articles &amp; long-form content
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {work.map((item) => (
            <a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-3 p-6 bg-white border border-[#E5E7EB] rounded-xl hover:border-[#4F46E5] hover:shadow-sm transition-all"
            >
              <span className="text-xs font-semibold text-[#4F46E5]">{item.publication}</span>
              <h3 className="text-base font-semibold text-[#111827] group-hover:text-[#4F46E5] transition-colors leading-snug">
                {item.title}
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed flex-1">{item.description}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium px-2.5 py-1 bg-[#F3F4F6] text-[#6B7280] rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
