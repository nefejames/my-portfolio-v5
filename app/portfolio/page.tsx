import type { Metadata } from 'next'
import { getAllPortfolioArticles, getPortfolioClients } from '@/lib/portfolio'
import PortfolioList from '@/components/portfolio/PortfolioList'

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    'Articles and long-form content written for clients like AltexSoft, Prismic, LogRocket, and Dojah.',
}

export default async function PortfolioPage() {
  const [articles, clients] = await Promise.all([
    getAllPortfolioArticles(),
    getPortfolioClients(),
  ])

  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 pb-24">
      <div className="mb-12">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#4F46E5] mb-4">
          Portfolio
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-[#111827] mb-6">
          Client work &amp; published articles
        </h1>
        <p className="text-lg text-[#6B7280] max-w-xl">
          Long-form articles and technical content written for companies across
          developer tools, SaaS, and fintech.
        </p>
      </div>

      <PortfolioList articles={articles} clients={clients} />
    </div>
  )
}
