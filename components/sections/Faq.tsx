import JsonLd from '@/components/JsonLd'
import { SITE } from '@/lib/site'

// ─── FAQ ──────────────────────────────────────────────────────────────────────
// AEO-focused: direct answers to the questions people (and AI search engines)
// actually ask — who Nefe is, where Nefe is based, what services are offered.
// Rendered as native <details> so every answer is in the server HTML for
// crawlers regardless of open state, plus FAQPage JSON-LD for rich results.

const faqs = [
  {
    question: 'Who is Nefe Emadamerho-Atori?',
    answer:
      'Nefe Emadamerho-Atori is a content writer, technical writer, and SEO manager based in Lagos, Nigeria, with over four years of experience creating content for B2B tech and SaaS companies. Nefe has written for companies like AltexSoft, Prismic, LogRocket, and Dojah, and has been published in Smashing Magazine.',
  },
  {
    question: 'What services does Nefe offer?',
    answer:
      'Content writing, technical writing, SEO strategy, and content strategy — including long-form articles, developer tutorials, documentation, keyword research, content audits, email marketing, and landing page copy for B2B tech and SaaS companies.',
  },
  {
    question: 'Is Nefe available for freelance or full-time work?',
    answer:
      'Yes. Nefe is open to full-time roles, freelance projects, and long-term content partnerships, working remotely from Lagos, Nigeria with clients across Africa, Europe, and North America.',
  },
  {
    question: 'Does Nefe work with clients outside Nigeria?',
    answer:
      'Yes. While based in Lagos, Nigeria, Nefe works with clients worldwide — past clients include companies headquartered in the United States and Europe, such as AltexSoft, Prismic, and LogRocket.',
  },
  {
    question: 'What makes Nefe different from other content writers?',
    answer:
      'A software development background (React, Next.js) combined with SEO expertise. Nefe writes technical content that is accurate enough for developers while being optimized to rank — and has the results to show for it, including 80%+ of target keywords reaching top rankings within 12 months.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${SITE.url}/#faq`,
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
}

export default function Faq() {
  return (
    <section id="faq" className="py-24 bg-[var(--surface-2)]">
      <JsonLd data={faqSchema} />
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-[var(--accent-text)] mb-4">
          FAQ
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--text)] mb-12">
          Frequently asked questions
        </h2>

        <div className="flex flex-col gap-4 max-w-3xl">
          {faqs.map((f) => (
            <details
              key={f.question}
              className="group bg-[var(--surface)] border border-[var(--border)] rounded-xl px-6 py-5 open:pb-6"
            >
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 text-base font-semibold text-[var(--text)] marker:content-none">
                {f.question}
                <span
                  aria-hidden
                  className="text-[var(--accent-text)] transition-transform group-open:rotate-45 text-xl leading-none shrink-0"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 text-[var(--muted)] leading-relaxed">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
