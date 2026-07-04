import type { Metadata } from 'next'
import { getAllPortfolioArticles, getPortfolioClients, toCardData } from '@/lib/portfolio'
import PortfolioList from '@/components/portfolio/PortfolioList'

const description =
  'Articles and long-form content written for clients like AltexSoft, Prismic, LogRocket, and Dojah.'

export const metadata: Metadata = {
  title: 'Portfolio',
  description,
  alternates: { canonical: '/portfolio' },
  openGraph: {
    type: 'website',
    url: '/portfolio',
    title: 'Portfolio',
    description,
  },
}

export default async function PortfolioPage() {
  const [articles, clients] = await Promise.all([
    getAllPortfolioArticles(),
    getPortfolioClients(),
  ])

  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 pb-24">
      <div className="mb-12">
        <p className="text-xs font-semibold tracking-widest uppercase text-[var(--accent-text)] mb-4">
          Portfolio
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-6">
          Client work &amp; published articles
        </h1>
        <p className="text-lg text-[var(--muted)] max-w-xl">
          Long-form articles and technical content written for companies across
          developer tools, SaaS, and fintech.
        </p>
      </div>

      {/* Trimmed to card fields — excerpts/URLs/tags stay out of the payload. */}
      <PortfolioList articles={articles.map(toCardData)} clients={clients} />
    </div>
  )
}
