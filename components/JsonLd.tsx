// Renders a JSON-LD structured-data block. Server-rendered into the initial
// HTML so crawlers and AI search engines see it without executing JavaScript.
export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  // Escape "<" so a stray "</script>" in any title/excerpt can't terminate the
  // block early. "<" is still valid JSON and parses identically.
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  )
}
