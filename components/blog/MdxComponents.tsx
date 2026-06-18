import Image from 'next/image'
import { getTweet } from 'react-tweet/api'
import { EmbeddedTweet, TweetNotFound } from 'react-tweet'
import { YouTubeEmbed } from '@next/third-parties/google'
import { slugify } from '@/lib/toc'
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
      <div className="my-8 p-5 border border-[#E5E7EB] rounded-xl bg-[#F9FAFB] flex items-center gap-3">
        <svg className="w-5 h-5 text-[#6B7280] shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.84L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <p className="text-sm text-[#6B7280]">
          Tweet preview unavailable.{' '}
          <a
            href={`https://x.com/i/status/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#4F46E5] hover:underline font-medium"
          >
            View on X →
          </a>
        </p>
      </div>
    )
  }
}

// ─── YouTube embed ───────────────────────────────────────────────────────────
// Usage: <YouTube id="dQw4w9WgXcQ" />
function YouTube({ id }: { id: string }) {
  return (
    <div className="my-8 rounded-xl overflow-hidden aspect-video">
      <YouTubeEmbed videoid={id} params="rel=0" />
    </div>
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
        className="w-full rounded-xl border border-[#E5E7EB]"
        height={570}
        allowFullScreen
        title="LinkedIn post"
        loading="lazy"
      />
    </div>
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
    <figure className="my-8">
      <div className="relative w-full rounded-xl overflow-hidden bg-[#F3F4F6]">
        <Image src={src} alt={alt} width={width} height={height} className="w-full h-auto" />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-[#6B7280] italic">
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
  Figure,
  h2: H2,
  h3: H3,
  img: ({ src, alt }: { src?: string; alt?: string }) => (
    <Figure src={src ?? ''} alt={alt ?? ''} />
  ),
}
