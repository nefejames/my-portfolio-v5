// ─── Site-wide constants ──────────────────────────────────────────────────────
// Single source of truth for canonical URL, identity, and social profiles. Used
// by metadata, robots, sitemap, OG image generation, and JSON-LD. Override the
// production origin with NEXT_PUBLIC_SITE_URL when a custom domain is attached.

const rawUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://my-portfolio-v5-nine.vercel.app'

export const SITE = {
  /** Canonical origin, no trailing slash. */
  url: rawUrl.replace(/\/$/, ''),
  name: 'Emadamerho-Atori Nefe',
  title: 'Emadamerho-Atori Nefe — Content Marketer & SEO Manager',
  description:
    'Technical content writer and SEO manager with 4+ years of experience helping tech companies grow through content that earns top rankings and drives real results.',
  jobTitle: 'Content Marketer & SEO Manager',
  email: 'nefejames1@gmail.com',
  locale: 'en_US',
  /** Public profiles — used for Person.sameAs in JSON-LD. */
  social: {
    linkedin: 'https://linkedin.com/in/nefe-emadamerho-atori',
  },
} as const

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path = '/'): string {
  return new URL(path, SITE.url).toString()
}
