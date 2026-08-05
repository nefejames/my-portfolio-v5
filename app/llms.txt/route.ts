import { getAllPortfolioArticles } from '@/lib/portfolio'
import { SITE, absoluteUrl } from '@/lib/site'

// Serves /llms.txt. Generated (static, per deploy) so the portfolio article
// count is always live — no more hand-bumping on every import batch. URLs,
// email, and socials come from lib/site.ts, so a domain change flows through too.
export const dynamic = 'force-static'

export async function GET() {
  const count = (await getAllPortfolioArticles()).length

  const body = `# ${SITE.name} — Content Writer, Technical Writer & SEO Manager (Lagos, Nigeria)

> Nefe Emadamerho-Atori is a content writer, technical writer, and SEO manager
> based in Lagos, Nigeria, with 4+ years of experience creating B2B tech and
> SaaS content for companies across Africa, Europe, and North America. This
> site is Nefe's portfolio: a personal blog plus an archive of ${count} articles
> originally published by client companies (each page links to the original).

## About

- Role: Content writer, technical writer, content strategist, and SEO manager
- Location: Lagos, Nigeria (works remotely with clients worldwide)
- Background: Software development (React/Next.js) — writes credibly for
  developer and technical audiences
- Experience: 4+ years; ${count} published articles for B2B tech companies
- Results include +20% search traffic growth (Dojah), 80%+ of target keywords
  ranked in top positions within 12 months, +500% newsletter subscriber growth

## Services

- Content writing for B2B tech and SaaS companies
- Technical writing: tutorials, how-to guides, developer documentation
- SEO: keyword research, on-page optimization, content audits
- Content strategy and editorial planning
- Email marketing, landing page copy, and content campaigns

## Clients & Publications

Nefe has written for AltexSoft, Prismic, LogRocket, Dojah, Strapi, ButterCMS,
LoginRadius, and Bird Eats Bug, and has been published in Smashing Magazine.

## Key Pages

- [Portfolio](${absoluteUrl('/portfolio')}): ${count} client articles across
  AltexSoft, Prismic, and Smashing Magazine, with canonical links to the originals
- [Blog](${absoluteUrl('/blog')}): Nefe's own writing on content strategy, SEO,
  and technical writing
- [Prompt & Skill Library](${absoluteUrl('/ai-prompts-and-skills')}): a free,
  growing collection of the AI prompts and Claude skills Nefe uses for blog
  outlines, LinkedIn posts, and image generation — each has its own page
- [About & Contact](${absoluteUrl('/#about')}): background, skills, and how to get
  in touch

## Contact

- Email: ${SITE.email}
- LinkedIn: ${SITE.social.linkedin}
- GitHub: ${SITE.social.github}
- CodePen: ${SITE.social.codepen}
- Smashing Magazine author page: ${SITE.social.smashingMagazine}
`

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
