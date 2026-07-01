import { SITE } from '@/lib/site'
import { renderOgImage, ogSize, ogContentType } from '@/lib/og'

export const size = ogSize
export const contentType = ogContentType
export const alt = SITE.title

// Mirrors opengraph-image so X/Slack/iMessage render a large card too. Next
// collects twitter-image separately from opengraph-image (no auto-fallback).
export default function Image() {
  return renderOgImage({
    title: 'Content that earns top rankings and drives real results.',
    eyebrow: SITE.jobTitle,
  })
}
