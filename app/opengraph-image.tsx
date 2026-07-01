import { SITE } from '@/lib/site'
import { renderOgImage, ogSize, ogContentType } from '@/lib/og'

export const size = ogSize
export const contentType = ogContentType
export const alt = SITE.title

// Default social card, inherited by every route without its own image.
export default function Image() {
  return renderOgImage({
    title: 'Content that earns top rankings and drives real results.',
    eyebrow: SITE.jobTitle,
  })
}
