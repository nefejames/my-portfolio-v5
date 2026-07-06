// ─── Site-wide constants ──────────────────────────────────────────────────────
// Single source of truth for canonical URL, identity, location, and social
// profiles. Used by metadata, robots, sitemap, manifest, llms.txt, OG image
// generation, and JSON-LD. Override the production origin with
// NEXT_PUBLIC_SITE_URL when a custom domain is attached.

const rawUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://my-portfolio-v5-nine.vercel.app'

export const SITE = {
  /** Canonical origin, no trailing slash. */
  url: rawUrl.replace(/\/$/, ''),
  name: 'Emadamerho-Atori Nefe',
  title: 'Emadamerho-Atori Nefe — Content Writer & SEO Manager in Lagos, Nigeria',
  description:
    'Nefe Emadamerho-Atori is a content writer, technical writer, and SEO manager based in Lagos, Nigeria, with 4+ years of experience helping B2B tech and SaaS companies across Africa and worldwide grow through content that earns top rankings and drives real results.',
  jobTitle: 'Content Writer, Technical Writer & SEO Manager',
  email: 'nefejames1@gmail.com',
  locale: 'en_US',

  /** Where Nefe is based — feeds Person schema, metadata, and page copy.
   *  Target queries are geo-flavored ("content writer in Nigeria"), so this
   *  must surface consistently in schema AND visible text. */
  location: {
    city: 'Lagos',
    country: 'Nigeria',
    countryCode: 'NG',
    continent: 'Africa',
  },

  /** Search phrases the site should be findable for (metadata keywords +
   *  reference for writing page copy). */
  keywords: [
    'content writer in Nigeria',
    'technical writer in Nigeria',
    'content strategist in Nigeria',
    'freelance content writer Nigeria',
    'SEO manager in Nigeria',
    'content writer in Lagos',
    'content writer in Africa',
    'technical writer in Africa',
    'content strategist in Africa',
    'B2B content writer',
    'SaaS content writer',
    'content marketing',
    'technical writing',
    'SEO content strategy',
  ],

  /** What Nefe knows/does — Person.knowsAbout in JSON-LD (entity signals for
   *  both classic search and AI search). */
  expertise: [
    'Content Writing',
    'Technical Writing',
    'Content Strategy',
    'SEO (Search Engine Optimization)',
    'Content Marketing',
    'B2B SaaS Content',
    'Developer Documentation',
    'Keyword Research',
    'Email Marketing',
    'React and Next.js',
  ],

  /** Public profiles — Person.sameAs in JSON-LD. Author pages on established
   *  publications are strong entity-reconciliation signals: they let Google
   *  and AI models connect this site to the published body of work. */
  social: {
    linkedin: 'https://linkedin.com/in/nefe-emadamerho-atori',
    github: 'https://github.com/nefejames',
    codepen: 'https://codepen.io/nefejames',
    smashingMagazine: 'https://www.smashingmagazine.com/author/nefe-emadamerho-atori/',
  },
} as const

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path = '/'): string {
  return new URL(path, SITE.url).toString()
}
