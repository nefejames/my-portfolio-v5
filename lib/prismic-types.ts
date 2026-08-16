import type { KeyTextField, DateField, BooleanField } from '@prismicio/client'

export interface BlogPostDocument {
  type: 'blog_post'
  uid: string
  tags: string[]
  data: {
    title: KeyTextField
    date: DateField
    excerpt: KeyTextField
    cover_image: KeyTextField
    featured: BooleanField
    body_mdx: KeyTextField
  }
}

export type AllDocumentTypes = BlogPostDocument
