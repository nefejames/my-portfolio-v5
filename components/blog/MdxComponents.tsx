import Image from 'next/image'
import { Tweet } from 'react-tweet'
import { YouTubeEmbed } from '@next/third-parties/google'

// ─── Twitter/X embed ─────────────────────────────────────────────────────────
// Usage: <Tweet id="1234567890" />
// Server-rendered via react-tweet — no Twitter JS loaded

// ─── YouTube embed ───────────────────────────────────────────────────────────
// Usage: <YouTube id="dQw4w9WgXcQ" />
function YouTube({ id, title }: { id: string; title?: string }) {
  return (
    <div className="my-8 rounded-xl overflow-hidden aspect-video">
      <YouTubeEmbed videoid={id} params="rel=0" />
    </div>
  )
}

// ─── LinkedIn embed ───────────────────────────────────────────────────────────
// Usage: <LinkedIn url="https://www.linkedin.com/posts/username_..." />
// LinkedIn post URLs follow the pattern: /posts/name_slug-ugcPost-ID-hash
// The embed URL is constructed as: /embed/feed/update/urn:li:ugcPost:ID
function LinkedIn({ url }: { url: string }) {
  // Accept a pre-built embed URL or a regular post URL
  const embedUrl = url.includes('/embed/')
    ? url
    : (() => {
        // Extract ugcPost or share ID from the URL
        const ugcMatch = url.match(/ugcPost-(\d+)/)
        const shareMatch = url.match(/activity-(\d+)/)
        if (ugcMatch) return `https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:${ugcMatch[1]}`
        if (shareMatch) return `https://www.linkedin.com/embed/feed/update/urn:li:activity:${shareMatch[1]}`
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
// Usage: <Figure src="/images/chart.png" alt="Chart showing traffic growth" caption="Monthly organic traffic, Jan–Dec 2023" />
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
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-[#6B7280] italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// ─── Export all custom MDX components ────────────────────────────────────────
export const mdxComponents = {
  Tweet,
  YouTube,
  LinkedIn,
  Figure,
  // Override default img with Figure for inline images
  img: ({ src, alt }: { src?: string; alt?: string }) => (
    <Figure src={src ?? ''} alt={alt ?? ''} />
  ),
}
