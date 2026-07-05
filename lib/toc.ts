export interface TocItem {
  id: string
  text: string
  level: 2 | 3
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[`*_[\]()#]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Headings are read from RAW markdown, so escapes ("1\. Vuetify") and inline
// markers (`code`, **bold**, [links](url)) would leak into the TOC text as-is.
// The rendered heading unescapes all of these — mirror that here. Anchor ids
// stay in sync because slugify strips the same characters on both sides.
function cleanHeadingText(raw: string): string {
  return raw
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // [text](url) → text
    .replace(/\\([\\`*_{}[\]()#+\-.!>])/g, '$1') // markdown escapes → literal
    .replace(/[`*]/g, '') // inline code / emphasis markers
    .trim()
}

export function extractToc(mdxContent: string): TocItem[] {
  const lines = mdxContent.split('\n')
  const items: TocItem[] = []

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/)
    if (!match) continue
    const level = match[1].length as 2 | 3
    const text = cleanHeadingText(match[2])
    items.push({ id: slugify(text), text, level })
  }

  return items
}
