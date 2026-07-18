# Emadamerho-Atori Nefe — Portfolio & Blog

Personal site for **Nefe Emadamerho-Atori** — a content writer, technical writer,
and SEO manager based in Lagos, Nigeria. It combines a personal **blog**, a
**portfolio archive** of 135 articles written for client publications (AltexSoft,
Prismic, Smashing Magazine), and a shared MDX rendering pipeline so both surfaces
get the same features automatically.

Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and
**MDX**. Deployed on Vercel. Dark, editorial-minimalist design with an animated
signature logo.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Scripts: `npm run dev`, `npm run build`, `npm run start`, `npm run lint`.
Utility: `node scripts/generate-logo.mjs` (regenerates the static logo assets —
see [Branding](#branding--the-logo)).

## Environment variables

Create `.env.local` (gitignored):

```bash
FIRECRAWL_API_KEY=fc-...          # for the portfolio import script only
NEXT_PUBLIC_SITE_URL=https://...  # canonical production origin (see Backlog)
```

> If `NEXT_PUBLIC_SITE_URL` is unset, the site falls back to a placeholder
> origin defined in [`lib/site.ts`](lib/site.ts). That origin feeds **every**
> canonical tag, the sitemap, OG images, JSON-LD, and `llms.txt` — so set it to
> the real domain before relying on SEO. See **Backlog**.

## Content

| Type | Location | Notes |
|---|---|---|
| Blog posts | `content/posts/*.mdx` | Personal-brand articles (4 today) |
| Portfolio articles | `content/portfolio/<client>/NNN-slug.mdx` | Client-published work, numbered per client (135 today) |
| Article images | `public/portfolio/<client>/<article>/` | WebP, served by `next/image` |

Portfolio archive today: **59 AltexSoft + 71 Prismic + 5 Smashing Magazine = 135**.
Both content types load through [`lib/posts.ts`](lib/posts.ts) /
[`lib/portfolio.ts`](lib/portfolio.ts) — the data layer is abstracted so a future
CMS swap (see Backlog → Prismic) touches only those files. Loaders are wrapped in
React `cache()` so a page render reads each file once.

**Featuring on the homepage:** add `featured: true` to a post's or article's
frontmatter. The homepage "Writing for my own brand" and "Selected work" sections
each show up to 6 featured items.

### Shared MDX renderer

[`components/blog/MdxContent.tsx`](components/blog/MdxContent.tsx) renders both
blog and portfolio MDX with one pipeline, so improvements benefit both surfaces
at once:

- **Syntax-highlighted code blocks** (Shiki via `rehype-pretty-code`) with a
  language badge and click-to-copy button ([`CodeBlock.tsx`](components/blog/CodeBlock.tsx))
- **Image captions** — markdown images render as `<figure>`/`<figcaption>`,
  capped and centered
- **Embeds:** `<Tweet id=…>`, `<YouTube id=… caption=…>`, `<LinkedIn url=…>`,
  `<CodePen user=… id=… title=…>`
- **GFM tables** (used by imported comparison tables)

Article pages share one shell, [`components/ArticleLayout.tsx`](components/ArticleLayout.tsx)
— reading-progress bar, header, mobile + sticky-sidebar tables of contents
(viewport-capped so long TOCs scroll internally), prose styling, and footer.

## Importing portfolio articles (FireCrawl)

```bash
node scripts/import-article.js --url "<article-url>" --client <slug>
node scripts/import-article.js --batch urls.txt --client <slug>
node scripts/import-article.js --crawl "<author-page>" --client <slug>
```

The script scrapes via FireCrawl, downloads images locally and **re-encodes
PNG/JPEG to WebP** (`sharp`), rewrites URLs, converts tweet/YouTube/LinkedIn/
CodePen links to embed components, auto-numbers the file, and writes canonical
frontmatter pointing at the original publication.

**Per-client cleanup** strips each publisher's page chrome (nav, promos,
newsletter widgets, related blocks). Each client has its own function, scoped by
`--client`:

- `altexsoftCleanup()` — restores YouTube embeds from schema.org video data
- `smashingCleanup()` — strips template chrome, preserves the author's content
- `prismicCleanup()` — **slice-driven**: recovers the article's structured data
  from Next.js flight data to rebuild comparison tables, FAQ accordions, and
  video embeds that don't survive plain scraping; strips CTAs and related widgets

> **Local TLS note:** this machine runs Norton's HTTPS-scanning proxy
> (`wsc_proxy.exe`) that Node doesn't trust by default. Prefix import commands
> with `NODE_OPTIONS=--use-system-ca` if FireCrawl/image fetches fail with a
> certificate error. (The same proxy is why large `git push`es sometimes stall
> — see Backlog → repo size.)

## Branding — the logo

The **NEA signature mark** has one source of truth,
[`lib/logo.data.json`](lib/logo.data.json) (geometry, colors, stroke width). Three
renderings derive from it:

- The **animated navbar/splash logo** ([`AnimatedLogo.tsx`](components/AnimatedLogo.tsx))
  reads it live via [`lib/logo.ts`](lib/logo.ts) — the letters hand-write
  themselves stroke by stroke, replay on hover, and play as a ~2s splash intro
  once per session ([`SplashScreen.tsx`](components/SplashScreen.tsx)). Keyframes
  live in [`app/animations.css`](app/animations.css); reduced-motion is honored.
- **`public/logo.svg`** and **`app/icon.svg`** (favicon) can't import TS, so they
  are regenerated from the JSON:

```bash
node scripts/generate-logo.mjs   # run after editing lib/logo.data.json
```

To change the logo: edit `logo.data.json`, run the script. One place, one command.

## SEO & AEO

The site is optimized for both traditional search (Google, Bing) and AI search /
answer engines (ChatGPT, Claude, Perplexity, Google AI Overviews). Everything
below is driven from [`lib/site.ts`](lib/site.ts) — the single SEO config.

**Technical SEO**
- [`app/robots.ts`](app/robots.ts) — allows all crawlers, with explicit rules for
  AI bots (GPTBot, OAI-SearchBot, ClaudeBot, Claude-User/SearchBot, PerplexityBot,
  Google-Extended, Bingbot, Applebot, …)
- [`app/sitemap.ts`](app/sitemap.ts) — dynamic; includes the blog and all 135
  portfolio articles
- [`app/manifest.ts`](app/manifest.ts) — web app manifest with brand colors
- Self-referencing canonicals + `metadataBase` (root); portfolio articles set an
  **external** canonical to the original publication
- Unique title + description on every page; per-route `generateMetadata`
- Dynamic OG + Twitter images via [`lib/og.tsx`](lib/og.tsx)
- Baseline security headers in [`next.config.ts`](next.config.ts)

**Structured data** (JSON-LD via [`components/JsonLd.tsx`](components/JsonLd.tsx))
- `Person` — with geo signals (Lagos/NG address, nationality, `areaServed`,
  `knowsAbout`, and `sameAs` linking LinkedIn, GitHub, CodePen, and the Smashing
  Magazine author page for entity reconciliation)
- `WebSite`, `ProfilePage` (homepage), `BlogPosting`/`Article`, `BreadcrumbList`,
  and `FAQPage`

**AEO-specific**
- [`public/llms.txt`](public/llms.txt) — AI-readable summary (who, services,
  location, clients, results, key pages). **Article count is hand-maintained** —
  bump it on every import batch (see Backlog for automating this).
- Homepage **FAQ section** ([`Faq.tsx`](components/sections/Faq.tsx)) — native
  `<details>` (answers in the server HTML) + `FAQPage` schema, geo-rich answers
- Visible location copy across Hero, About, and Contact

> **Off-site (not code):** buy the domain, verify in Google Search Console + Bing
> Webmaster Tools, submit the sitemap, and keep the LinkedIn headline consistent
> with the schema. See Backlog.

## Backlog / TODO

### Infrastructure & blocking

- [ ] **Shrink the repo (~800MB).** `.git` history is ~409MB and `public/` is
      ~410MB (1,055 portfolio images). This is the root cause of the stalling
      `git push`es. Options: move images to **Vercel Blob / a CDN**, adopt **git
      LFS**, or a one-time history rewrite (BFG) to reclaim `.git` bloat. Highest
      infra ROI — also speeds clones and any future CI.
- [ ] **Move `firecrawl` to `devDependencies`.** It's a production dependency but
      only `scripts/import-article.js` uses it, so Vercel installs it on every
      deploy for nothing. One-line `package.json` move.
- [ ] **Add CI (GitHub Actions).** No workflow runs `build`/`lint` on push. A
      simple Action catches TypeScript/lint regressions before they reach
      production.

### Growth & SEO

- [ ] **Set up Google Search Console + GA4 analytics.**
      - *Search Console:* the `google` verification meta tag is already emitted
        (`verification.google` in `lib/site.ts`). Remaining is account-side: add
        the property, submit `/sitemap.xml`, watch Coverage. Add **Bing Webmaster
        Tools** — Bing grounds ChatGPT/Copilot answers.
      - *GA4:* `@next/third-parties` is already installed. Create a GA4 property,
        put the ID in `NEXT_PUBLIC_GA_ID`, render `<GoogleAnalytics
        gaId={process.env.NEXT_PUBLIC_GA_ID} />` in `app/layout.tsx` (env-guarded).
- [ ] **RSS/Atom feed for the blog.** None exists. Good for subscribers and a
      discovery signal for both classic and AI crawlers. ~one route file.
- [ ] **Related-articles internal linking.** Article pages have no "related posts"
      section. Internal links spread ranking signal and make the 135-article
      archive navigable — high on-page-SEO ROI.
- [ ] **Adjust copy across all pages.** Editorial polish pass for consistency and
      geo positioning ("content writer in Nigeria"). Components no longer say the
      old "content marketer" title, so this is now about tightening value props
      and CTAs across Hero, Services, Results, About, FAQ, Contact, and the two
      index pages. Copy-only; no layout/design changes.
- [ ] **Migrate content to Prismic (CMS).** The data layer is already abstracted
      behind `lib/posts.ts` / `lib/portfolio.ts`, so a swap touches mainly those
      files plus the frontmatter → props mapping; the shared MDX renderer and page
      components stay. Model blog posts as a Prismic type (Slice Machine), point
      `lib/posts.ts` at the Prismic client, keep `content/**` MDX as fallback until
      parity is confirmed. Decide whether the 135-article archive moves into
      Prismic or stays file-based (it's write-once and canonical-attributed, so
      MDX is reasonable).

### Performance & polish

- [ ] **Paginate the `/portfolio` list.** It renders all 135 cards (and 135
      `next/image` thumbnails) in one DOM — fine now, degrades as the archive
      grows. Add pagination or an initial slice with load-more.
- [ ] **Further image optimization.** Images already serve sized WebP via
      `next/image` + a `sizes` hint (imports are WebP too). If pages feel slow, in
      rough priority: (1) enable **AVIF** — `images: { formats: ['image/avif',
      'image/webp'] }` in `next.config.ts` (~20–30% smaller, no dependency);
      (2) **blur placeholders** (build step with `sharp`/`plaiceholder`, adds a
      dependency); (3) drop image **quality** 75→65. Note: most first-scroll lag is
      Vercel's one-time on-demand optimization, cached at the edge after first view.
- [ ] **Fill in the real prompt & skill content, + optional download field.** The
      seeded items in `content/prompts/*.md` are placeholders — replace each body
      with the actual prompt/SKILL.md text. The copy button grabs the file body
      **verbatim**, so for a skill, paste the real SKILL.md and readers can copy it
      straight into a Claude project. If a skill is actually a multi-file package
      rather than one block, add an optional `downloadUrl` / `repoUrl` frontmatter
      field + a button on the item page (small change to `lib/prompts.ts` + the
      `[slug]` page).
- [ ] **Reading-time estimate** on blog + portfolio articles ("6 min read").
- [ ] **Visible breadcrumb nav.** `BreadcrumbList` schema is emitted but there's
      no visible breadcrumb UI; adding it reinforces the structured data.
- [ ] **Automate the `llms.txt` article count.** Currently bumped by hand each
      import batch; a small build step could inject the live count so it can't drift.
- [ ] **Add a full Content-Security-Policy.** Omitted in `next.config.ts` for now
      — needs an allowlist for YouTube iframes, react-tweet, CodePen embeds, and
      Google Fonts, tested so it doesn't silently break embeds.

### Done

- [x] **Custom domain live** — nefeatori.com attached in Vercel; the `SITE.url`
      default in `lib/site.ts` points to it (canonicals/sitemap/robots/OG/JSON-LD
      all derive from it). Still to do off-site: verify in Search Console + Bing.
- [x] **Prompt & Skill Library** — `/ai-prompts-and-skills` (prompts + skills,
      filter by type and category, per-item pages with copy button + HowTo schema);
      old `/prompts` URLs 308-redirect to it.
- [x] **AEO/SEO foundation** — geo `Person` schema, AI-crawler robots rules,
      `llms.txt`, homepage FAQ + `FAQPage` schema, manifest, portfolio URLs in the
      sitemap, visible Lagos/Nigeria copy.
- [x] **Per-client import cleanup** — `altexsoftCleanup()`, `smashingCleanup()`,
      and slice-driven `prismicCleanup()` all exist.
- [x] **WebP on import** — PNG/JPEG downloads re-encoded to WebP (~60–90% smaller).
- [x] **Single-source logo** — geometry in `lib/logo.data.json`; static assets
      regenerated via `scripts/generate-logo.mjs`.
- [x] **Shared `ArticleLayout`** for blog + portfolio; **CodePen embeds**;
      **click-to-copy code blocks**; dead-code/dependency cleanup.

## Parked idea — a living "codebase context" doc (revisit)

**Problem it solves:** the planning phase happens in a separate Claude that has
**no repo access**, so its master prompts are written against an *imagined*
codebase — it invents `lib/seo.ts`, shadcn/ui, Framer Motion (none exist here),
and I then have to correct course. A living context doc grounds any LLM, and also
lets Claude Code skip re-reading files.

**Core idea — one tight doc, split by who can keep each part true:**
1. **Generated "map" (facts that can't drift)** — routes, key files + exports,
   dependencies, content types, and a **"what this codebase does NOT use"** list
   (that list is the highest-value part — it's what stops the hallucinations).
   Produced by a script from the actual code.
2. **Curated "conventions & gotchas" (judgment)** — e.g. *JSON-LD is inline via
   `<JsonLd>`, not a lib; content lives in `content/*`; MDX crashes on `{}`/`<>`
   so prompts render as plain text; SEO flows from `SITE.url`; the Norton proxy
   breaks TLS.* Changes rarely; updated deliberately.

**Two ways to keep it "living":**
- **Without Claude Code (any LLM):** a Node generator + a **git pre-commit hook or
  CI** that regenerates the map and *fails if the committed doc is stale*. Feed it
  to the planning Claude by pasting into the Project's knowledge — or **connect the
  GitHub repo to the Claude.ai Project** (attacks the root cause: it reads the real
  code, not a snapshot).
- **With Claude Code:** import the doc into **`AGENTS.md`** (auto-loaded every
  session — the "don't re-read files" win); run the generator in the existing
  **auto-commit Stop hook**; refresh the prose via a `/sync-context` command after
  meaningful architectural changes.

**Recommendation (hybrid):** `scripts/generate-context.mjs` (mirrors
`generate-logo.mjs`) writes the map into `AGENTS.md`; I curate the conventions +
"does NOT use" list once; run it in the Stop hook + CI; paste/connect to the
planning Project. Keep it **short** (~40 lines) — a generator enforces that.
**Open decision:** full hybrid, or lean on the GitHub-connector and skip the
generated doc?

## Deploy

Hosted on Vercel. Pushing to the default branch (`master`) triggers a production
deploy; preview deployments are created per branch/PR. Large image pushes can
stall behind the local HTTPS-scanning proxy — retry, or address repo size
(Backlog) to make pushes reliable.
