import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/site'

// Generates /robots.txt. AI crawlers (GPTBot, ClaudeBot, PerplexityBot, …) are
// intentionally allowed — for a personal brand, being cited by AI search drives
// awareness. Narrow this later if that calculus changes.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  }
}
