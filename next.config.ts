import type { NextConfig } from 'next'

// Security headers applied to every route.
//
// CSP design notes:
// - Fonts: next/font/google self-hosts at build time → no external font URLs needed.
// - Scripts: Next.js App Router injects inline hydration scripts, so 'unsafe-inline'
//   is required here. A nonce-based strict CSP would remove this but needs middleware.
// - Styles: 'unsafe-inline' covers Tailwind's runtime utilities and react-tweet styles.
// - Images: 'self' + data: covers local assets; pbs.twimg.com / i.ytimg.com cover
//   react-tweet avatars and YouTube thumbnails from the lite-youtube component.
// - Frames: explicit allowlist for the three embed types used in MDX articles.
// - frame-ancestors 'none' replaces X-Frame-Options: DENY in CSP-aware browsers.
const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://pbs.twimg.com https://abs.twimg.com https://i.ytimg.com https://img.youtube.com",
  "media-src 'self'",
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://codepen.io https://www.linkedin.com",
  "connect-src 'self' https://us.i.posthog.com https://us-assets.i.posthog.com",
  "font-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
]

const securityHeaders = [
  { key: 'Content-Security-Policy', value: cspDirectives.join('; ') },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // X-Frame-Options is the pre-CSP fallback for browsers that don't support frame-ancestors.
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
]

const nextConfig: NextConfig = {
  // Serve AVIF first (≈20–30% smaller than WebP), falling back to WebP. next/image
  // negotiates per request via the Accept header; source files are untouched.
  images: {
    formats: ['image/avif', 'image/webp'],
  },
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
