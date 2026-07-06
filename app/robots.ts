import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/site'

// Generates /robots.txt. Everything is crawlable — for a personal brand,
// being indexed by search engines AND cited by AI search (ChatGPT, Claude,
// Perplexity, Google AI Overviews) drives awareness.
//
// The wildcard already permits every crawler; the named AI-bot rules make the
// policy explicit and survivable if the wildcard ever gets restricted later.
// Deliberately NOT disallowing /_next/ — Google must fetch JS/CSS to render.
export default function robots(): MetadataRoute.Robots {
  const aiCrawlers = [
    // OpenAI: training, ChatGPT browsing, and ChatGPT search
    'GPTBot',
    'ChatGPT-User',
    'OAI-SearchBot',
    // Anthropic: training, Claude browsing, and Claude search
    'ClaudeBot',
    'Claude-User',
    'Claude-SearchBot',
    // Perplexity
    'PerplexityBot',
    'Perplexity-User',
    // Google (search + AI Overviews/Gemini grounding) and Bing (Copilot)
    'Googlebot',
    'Google-Extended',
    'Bingbot',
    // Others commonly used for AI answers
    'Applebot',
    'Applebot-Extended',
    'cohere-ai',
    'meta-externalagent',
  ]

  return {
    rules: [
      { userAgent: '*', allow: '/' },
      ...aiCrawlers.map((userAgent) => ({ userAgent, allow: '/' })),
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  }
}
