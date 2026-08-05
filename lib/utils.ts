export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/** Estimated reading time in whole minutes (min 1), at ~220 wpm. Counts
 *  whitespace-separated tokens in the raw MDX — close enough for a label. */
export function readingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}
