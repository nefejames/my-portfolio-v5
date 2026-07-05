import Image from 'next/image'
import { getTweet } from 'react-tweet/api'
import { EmbeddedTweet, TweetNotFound } from 'react-tweet'
// Tweet styling ships only with routes that render MDX (blog + portfolio
// articles) instead of globally from the root layout.
import 'react-tweet/theme.css'
import { YouTubeEmbed } from '@next/third-parties/google'
import { slugify } from '@/lib/toc'
import CodeBlock from './CodeBlock'
import type { ReactNode } from 'react'

// ─── Twitter/X embed ─────────────────────────────────────────────────────────
// Wraps react-tweet with a try/catch so an SSL or network error shows a
// graceful fallback link instead of crashing the page.
// Usage: <Tweet id="1234567890" />
async function Tweet({ id }: { id: string }) {
  try {
    const tweet = await getTweet(id)
    if (!tweet) return <TweetNotFound />
    return (
      <div className="my-8 flex justify-center">
        <EmbeddedTweet tweet={tweet} />
      </div>
    )
  } catch {
    return (
      <div className="my-8 p-5 border border-[var(--border)] rounded-xl bg-[var(--surface-2)] flex items-center gap-3">
        <svg className="w-5 h-5 text-[var(--muted)] shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.84L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <p className="text-sm text-[var(--muted)]">
          Tweet preview unavailable.{' '}
          <a
            href={`https://x.com/i/status/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-text)] hover:underline font-medium"
          >
            View on X →
          </a>
        </p>
      </div>
    )
  }
}

// ─── YouTube embed ───────────────────────────────────────────────────────────
// Usage: <YouTube id="dQw4w9WgXcQ" caption="Optional caption" />
function YouTube({ id, caption }: { id: string; caption?: string }) {
  return (
    <figure className="my-8">
      <div className="rounded-xl overflow-hidden aspect-video">
        <YouTubeEmbed videoid={id} params="rel=0" />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-[var(--muted)] italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// ─── LinkedIn embed ───────────────────────────────────────────────────────────
// Usage: <LinkedIn url="https://www.linkedin.com/posts/username_...-ugcPost-ID-hash" />
// Note: viewers must be logged into LinkedIn to see the full post.
function LinkedIn({ url }: { url: string }) {
  const embedUrl = url.includes('/embed/')
    ? url
    : (() => {
        const ugcMatch = url.match(/ugcPost[-:](\d+)/)
        const activityMatch = url.match(/activity[-:](\d+)/)
        if (ugcMatch) return `https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:${ugcMatch[1]}`
        if (activityMatch) return `https://www.linkedin.com/embed/feed/update/urn:li:activity:${activityMatch[1]}`
        return url
      })()

  return (
    <div className="my-8">
      <iframe
        src={embedUrl}
        className="w-full rounded-xl border border-[var(--border)]"
        height={570}
        allowFullScreen
        title="LinkedIn post"
        loading="lazy"
      />
    </div>
  )
}

// ─── CodePen embed ───────────────────────────────────────────────────────────
// Usage: <CodePen user="nefejames" id="pvzzVLj" title="Optional title" />
// Uses CodePen's click-to-run preview mode: articles can carry dozens of pens,
// and preview mode keeps them static (and lazy-loaded) until the reader runs
// one — instead of executing every demo on page load.
function CodePen({
  user,
  id,
  title,
  height = 500,
}: {
  user: string
  id: string
  title?: string
  height?: number
}) {
  return (
    // Capped narrower than the article column (and centered) — pens are demos,
    // not hero media; full-column iframes dominated the reading flow.
    <figure className="my-8 max-w-xl mx-auto">
      <iframe
        src={`https://codepen.io/${user}/embed/preview/${id}?default-tab=result&theme-id=dark`}
        title={title ? `CodePen: ${title}` : 'CodePen embed'}
        height={height}
        loading="lazy"
        allowFullScreen
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)]"
      />
      <figcaption className="mt-2 text-center text-sm">
        <a
          href={`https://codepen.io/${user}/pen/${id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--accent-text)] hover:underline"
        >
          {title ? `${title} — open on CodePen →` : 'Open on CodePen →'}
        </a>
      </figcaption>
    </figure>
  )
}

// ─── Figure (image with caption) ─────────────────────────────────────────────
// Usage: <Figure src="/images/chart.png" alt="..." caption="..." />
function Figure({
  src,
  alt,
  caption,
  width = 1200,
  height = 675,
}: {
  src: string
  alt: string
  caption?: string
  width?: number
  height?: number
}) {
  return (
    // Capped and centered so images stay readable-editorial instead of growing
    // with the article column on wide screens.
    <figure className="my-8 max-w-2xl mx-auto">
      <div className="relative w-full rounded-xl overflow-hidden bg-[var(--surface-2)]">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          // Matches the figure's max-w-2xl (672px) cap above; full width below
          // it. Without this, next/image assumes 100vw and serves oversized files.
          sizes="(min-width: 768px) 672px, 100vw"
          className="w-full h-auto"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-[var(--muted)] italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// ─── Headings with auto-generated IDs (required for TOC anchor links) ────────
function getTextContent(node: ReactNode): string {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(getTextContent).join('')
  return ''
}

function H2({ children }: { children?: ReactNode }) {
  const id = slugify(getTextContent(children))
  return <h2 id={id}>{children}</h2>
}

function H3({ children }: { children?: ReactNode }) {
  const id = slugify(getTextContent(children))
  return <h3 id={id}>{children}</h3>
}

// ─── Export ───────────────────────────────────────────────────────────────────
export const mdxComponents = {
  Tweet,
  YouTube,
  LinkedIn,
  CodePen,
  Figure,
  h2: H2,
  h3: H3,
  // Markdown images render as a <figure>; the alt text doubles as the visible
  // caption (![This is the caption](./image.jpg)). Shared by blog + portfolio.
  img: ({ src, alt }: { src?: string; alt?: string }) => (
    <Figure src={src ?? ''} alt={alt ?? ''} caption={alt || undefined} />
  ),
  // Fenced code blocks get VS Code-style chrome: language icon + name and a
  // click-to-copy button (see CodeBlock.tsx). Inline code is untouched.
  pre: CodeBlock,
}
