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
      re-submit the sitemap and re-verify in Google Search Console.
- [ ] **Add a full Content-Security-Policy.** Deliberately omitted in
      `next.config.ts` for now — it needs an allowlist for YouTube iframes,
      react-tweet, and Google Fonts, and should be tested so it doesn't silently
      break embeds.
- [ ] **Per-client import cleanup.** Only `altexsoftCleanup()` exists. Other
      publishers add their own chrome (e.g. Prismic callouts, promos, related
      blocks) and need a dedicated `<client>Cleanup()` — don't reuse AltexSoft's.
- [ ] **AltexSoft import dates.** AltexSoft pages expose no machine-readable
      date, so imports default `publishedAt` to today and need a manual fix
      (or parse the in-body "Published:" line).

## Deploy

Hosted on Vercel. Pushing to the default branch triggers a production deploy;
preview deployments are created per branch/PR.
