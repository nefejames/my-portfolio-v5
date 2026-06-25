import { getFeaturedPortfolioArticles } from '@/lib/portfolio'
import PortfolioCard from '@/components/portfolio/PortfolioCard'

export default async function SelectedWork() {
  // Curated on a per-article basis: add `featured: true` to a portfolio MDX
  // file's frontmatter to surface it here. Max 6; empty when none are featured.
  const featured = await getFeaturedPortfolioArticles(6)

  return (
    <section id="work" className="py-24 bg-[var(--bg)]">
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-[var(--accent-text)] mb-4">
          Selected work
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--text)] mb-16">
          Articles &amp; long-form content
        </h2>

        {featured.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {featured.map((article) => (
              <PortfolioCard
                key={`${article.clientSlug}/${article.slug}`}
                article={article}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
