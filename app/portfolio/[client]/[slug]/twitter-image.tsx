import { getAllPortfolioArticles, getPortfolioArticle } from '@/lib/portfolio'
import { renderOgImage, ogSize, ogContentType } from '@/lib/og'

export const size = ogSize
export const contentType = ogContentType
export const alt = 'Portfolio article'

export async function generateStaticParams() {
  const articles = await getAllPortfolioArticles()
  return articles.map((a) => ({ client: a.clientSlug, slug: a.slug }))
}

export default async function Image({
  params,
}: {
  params: Promise<{ client: string; slug: string }>
}) {
  const { client, slug } = await params
  const article = await getPortfolioArticle(client, slug)
  return renderOgImage({
    title: article?.title ?? 'Portfolio',
    eyebrow: 'Selected client work',
    badge: article?.client,
  })
}
