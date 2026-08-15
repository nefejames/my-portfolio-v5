import type { KeyTextField, DateField, BooleanField, NumberField } from '@prismicio/client'

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

export interface PortfolioArticleDocument {
  type: 'portfolio_article'
  uid: string
  tags: string[]
  data: {
    title: KeyTextField
    client: KeyTextField
    client_slug: KeyTextField
    original_url: KeyTextField
    published_at: DateField
    canonical: KeyTextField
    excerpt: KeyTextField
    cover_image: KeyTextField
    featured: BooleanField
    order: NumberField
    body_mdx: KeyTextField
  }
}

export type AllDocumentTypes = BlogPostDocument | PortfolioArticleDocument
