import type { NextConfig } from 'next'

// Baseline security headers applied to every route. These are safe defaults that
// don't risk breaking third-party embeds (YouTube, react-tweet) or fonts.
//
// NOTE: A full Content-Security-Policy is deliberately omitted — it needs an
// allowlist for the YouTube iframes, react-tweet, and Google Fonts this site
// loads, and should be added + tested separately to avoid silently breaking them.
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
]

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
  // The prompt library moved to /ai-prompts-and-skills (now prompts AND skills).
  // Permanent redirects preserve any links to the original /prompts URLs.
  async redirects() {
    return [
      { source: '/prompts', destination: '/ai-prompts-and-skills', permanent: true },
      { source: '/prompts/:slug', destination: '/ai-prompts-and-skills/:slug', permanent: true },
    ]
  },
}

export default nextConfig
