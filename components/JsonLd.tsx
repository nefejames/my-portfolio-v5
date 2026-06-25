// Renders a JSON-LD structured-data block. Server-rendered into the initial
// HTML so crawlers and AI search engines see it without executing JavaScript.
export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // Schema is built from trusted, static content — no user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
