# LinkedIn caption — Claude Fable 5 build log carousel

Pair with carousel.pdf (9 slides). Post as a document post; caption below.

---

I'm building my entire portfolio site with Claude Fable 5 — and it's doing things other AI models couldn't.

Quick story:

Months ago I tried to build a "signature" animation for my name with another model + Framer Motion. The output was broken. I scrapped it.

Last week I asked Fable 5 for a creative logo animation.

One prompt. It came back with my NEA logo hand-writing itself, stroke by stroke, like a signature — replay on hover, a 2-second splash intro that plays once per session, and it even handled accessibility (reduced-motion users get the static logo).

Perfect. First try.

But the animation is honestly the smallest part. Here's what it's actually done across the build:

📚 Content engine — scraped 75 of my published client articles (AltexSoft, Prismic, Smashing Magazine) into my own archive, cleaned each publisher's page clutter automatically, rebuilt tables + FAQs + video embeds from raw page data, and pointed canonical links back to every original (so no SEO cannibalization).

⚡ Performance — it found and removed 5 dead dependencies, trimmed oversized server payloads, rebuilt my scroll progress bar so scrolling triggers zero re-renders, fixed image size hints, and now auto-compresses every imported image (one 1.3MB PNG became 93KB).

🧹 Cleanup — previous models had hardcoded my email and links in 7 different places and copy-pasted the same layout twice. Fable 5 pulled everything into one config, merged the duplicated layouts into one shared component, and centralized all the animation code into a single file.

🔍 SEO — structured data on every page (Person, Article, Breadcrumbs), generated OG images for all 75 articles, sitemap, canonicals, the works. As an SEO manager, this is the part that sold me.

The scoreboard so far: 75 articles archived, 249 static pages, 50 commits shipped.

The difference isn't just that it writes code. It's that it thinks about structure, performance, and maintainability without me begging for it — and tells me when something I asked for is a bad idea.

Swipe through for the details 👇

I'm documenting the whole build — the wins, the prompts, and what AI still gets wrong. Follow along if you're curious what one person + one model can ship.

#BuildInPublic #ClaudeAI #AI #WebDevelopment #SEO #ContentMarketing #Portfolio

---

## Notes

- Slides are generated from build-carousel.js — edit the SLIDES copy and re-run:
  `node marketing/linkedin/claude-fable-5-carousel/build-carousel.js`
- Colors mirror the site tokens in app/globals.css (bg #0F0F12, accent #4F46E5).
- Georgia/Segoe UI stand in for Fraunces/Hanken Grotesk (closest system fonts
  available to the SVG rasterizer).
