import { getPostBySlug } from '@/lib/posts'
import { renderOgImage, ogSize, ogContentType } from '@/lib/og'

export const size = ogSize
export const contentType = ogContentType
export const alt = 'Blog post'

export const revalidate = 3600
export const dynamicParams = true

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  return renderOgImage({ title: post?.title ?? 'Blog', badge: 'Blog' })
}
