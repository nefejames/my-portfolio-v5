# Emadamerho-Atori Nefe — Portfolio & Blog

Personal portfolio site for a content marketer / SEO manager. It combines a
personal **blog**, a **portfolio archive** of articles written for clients
(AltexSoft, Prismic, LogRocket, Dojah…), and a shared MDX rendering pipeline so
both surfaces get the same features automatically.

Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and
**MDX**. Deployed on Vercel.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

## Environment variables

Create `.env.local` (gitignored):

```bash
FIRECRAWL_API_KEY=fc-...          # for the portfolio import script
NEXT_PUBLIC_SITE_URL=https://...  # canonical production origin (see Backlog)
```

> If `NEXT_PUBLIC_SITE_URL` is unset, the site falls back to a placeholder
> origin defined in [`lib/site.ts`](lib/site.ts). That origin feeds **every**
> canonical tag, the sitemap, OG images, and JSON-LD — so set it to the real
> domain before relying on SEO. See **Backlog**.

## Content

| Type | Location | Notes |
|---|---|---|
| Blog posts | `content/posts/*.mdx` | Personal-brand articles |
| Portfolio articles | `content/portfolio/<client>/NNN-slug.mdx` | Client-published work, numbered per client |
| Article images | `public/portfolio/<client>/<article>/` | Served by `next/image` |

Both are loaded through `lib/posts.ts` / `lib/portfolio.ts` (the data layer is
abstracted so a future CMS swap touches only those files).

**Featuring on the homepage:** add `featured: true` to a post's or article's
frontmatter. The homepage "Writing for my own brand" and "Selected work"
sections each show up to 6 featured items.

### Shared MDX renderer

`components/blog/MdxContent.tsx` renders both blog and portfolio MDX with one
pipeline — Shiki syntax highlighting, image captions (`<figure>`/`<figcaption>`),
and embeds: `<Tweet id=…>`, `<YouTube id=… caption=…>`, `<LinkedIn url=…>`.
Improvements here benefit both surfaces at once.

## Importing portfolio articles (FireCrawl)

```bash
node scripts/import-article.js --url "<article-url>" --client <slug>
node scripts/import-article.js --batch urls.txt --client <slug>
node scripts/import-article.js --crawl "<author-page>" --client <slug>
```

The script scrapes via FireCrawl, downloads images locally, rewrites URLs,
converts tweet/YouTube/LinkedIn links to embed components, and auto-numbers the
file. AltexSoft imports also run `altexsoftCleanup()` (strips page chrome and
restores YouTube embeds from schema.org video data).

> **Local TLS note:** this machine runs a TLS-intercepting proxy that Node
> doesn't trust by default. Prefix import commands with
> `NODE_OPTIONS=--use-system-ca` if FireCrawl/image fetches fail with a
> certificate error.

## SEO

- `app/robots.ts` + `app/sitemap.ts`
- Self-referencing canonicals + `metadataBase` (root) / external canonicals
  (portfolio articles point to the original publication)
- Dynamic OG + Twitter cards via `lib/og.tsx`
- JSON-LD (Person, WebSite, BlogPosting/Article, BreadcrumbList) via
  `components/JsonLd.tsx`
- Baseline security headers in `next.config.ts`

## Backlog / TODO

- [ ] **Buy the domain and set `NEXT_PUBLIC_SITE_URL`.** Until then the site
      uses a placeholder Vercel origin in `lib/site.ts`, so canonicals, the
      sitemap, OG image URLs, and JSON-LD all point at a non-final domain. Set
      the env var in Vercel **and** `.env.local` once the domain is live, then
      re-submit the sitemap and re-verify in Google Search Console. Also update
      the absolute URLs in `public/llms.txt`. **Blocks the two items below** —
      do the domain first so analytics and search verification track the real
      origin from day one.
- [ ] **Set up Google Search Console + GA4 analytics.**
      - *Search Console:* the `google` verification meta tag is already emitted
        (`verification.google` in `lib/site.ts` → `app/layout.tsx`). Remaining is
        account-side: add the property in GSC, submit `/sitemap.xml`, and watch
        Coverage/Enhancements. Add **Bing Webmaster Tools** too — Bing grounds
        ChatGPT/Copilot answers.
      - *GA4:* `@next/third-parties` is already a dependency. Create a GA4
        property, put the measurement ID in `NEXT_PUBLIC_GA_ID`, and render
        `<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />` in
        `app/layout.tsx` (guard on the env var so it's a no-op in dev/preview).
- [ ] **Migrate content to Prismic (CMS).** The blog and portfolio data layer is
      already abstracted behind `lib/posts.ts` / `lib/portfolio.ts`, so a swap
      touches mainly those two files plus the frontmatter → props mapping; the
      shared MDX renderer and all page components stay. Plan: model blog posts as
      a Prismic type (Slice Machine), point `lib/posts.ts` at the Prismic client,
      keep `content/**` MDX as the fallback/source of truth until parity is
      confirmed. Decide whether the 135-article portfolio archive moves into
      Prismic or stays file-based (it's write-once and canonical-attributed, so
      leaving it as MDX is reasonable).
- [ ] **Adjust copy across all pages.** Do a full editorial pass for consistency
      and positioning now that the site targets geo queries ("content writer in
      Nigeria"). Check every surface — Hero, Services, Results, About, FAQ,
      Contact, the blog index, and the portfolio index — for a consistent title
      ("content writer" vs the older "content marketer"), tightened value props,
      and clear CTAs. Keep changes copy-only; don't touch layout or design.
- [ ] **Add a full Content-Security-Policy.** Deliberately omitted in
      `next.config.ts` for now — it needs an allowlist for YouTube iframes,
      react-tweet, CodePen embeds, and Google Fonts, and should be tested so it
      doesn't silently break embeds.
- [ ] **Further image optimization.** Article images already serve sized WebP
      variants via `next/image` + a `sizes` hint (and imports are re-encoded to
      WebP at scrape time). If pages still feel slow, consider (in rough
      priority): (1) enable **AVIF** — add
      `images: { formats: ['image/avif', 'image/webp'] }` to `next.config.ts`
      (~20–30% smaller, no new dependency, slightly slower first-time encode);
      (2) **blur placeholders** for nicer perceived loading — needs a build-time
      step with `sharp`/`plaiceholder` (adds a dependency); (3) drop image
      **quality** 75→65 (`quality={65}` on `next/image`) for smaller files.
      Note: most first-scroll lag is Vercel's one-time on-demand optimization —
      it's cached at the edge after the first view, so warm pages are fast.

### Done

- ~~Per-client import cleanup~~ — `altexsoftCleanup()`, `smashingCleanup()`, and
  `prismicCleanup()` (slice-driven) all exist in `scripts/import-article.js`.

## Deploy

Hosted on Vercel. Pushing to the default branch triggers a production deploy;
preview deployments are created per branch/PR.
