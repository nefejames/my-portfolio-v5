import { getPortfolioArticle } from '@/lib/portfolio'
import { renderOgImage, ogSize, ogContentType } from '@/lib/og'

export const size = ogSize
export const contentType = ogContentType
export const alt = 'Portfolio article'

export const revalidate = false
export const dynamicParams = true

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
