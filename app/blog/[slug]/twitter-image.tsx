import { getAllPosts, getPostBySlug } from '@/lib/posts'
import { renderOgImage, ogSize, ogContentType } from '@/lib/og'

export const size = ogSize
export const contentType = ogContentType
export const alt = 'Blog post'

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  return renderOgImage({ title: post?.title ?? 'Blog', badge: 'Blog' })
}
