import Link from 'next/link'
import type { PromptMeta } from '@/lib/prompts'

// One prompt in the library grid. The whole card links to the prompt's page —
// copy lives on that page, not here. Mirrors the blog/portfolio card styling.
export default function PromptCard({ prompt }: { prompt: PromptMeta }) {
  return (
    <Link
      href={`/prompts/${prompt.slug}`}
      className="group flex flex-col gap-3 p-6 bg-[var(--surface)] border border-[var(--border)] rounded-xl hover:border-[var(--accent-text)] hover:shadow-sm transition-all"
    >
      <span className="self-start text-xs font-medium px-2.5 py-1 bg-[var(--accent-subtle)] text-[var(--accent-text)] rounded-md">
        {prompt.category}
      </span>
      <h2 className="text-base font-semibold text-[var(--text)] group-hover:text-[var(--accent-text)] transition-colors leading-snug">
        {prompt.title}
      </h2>
      <p className="text-sm text-[var(--muted)] leading-relaxed">{prompt.description}</p>
      <span className="text-xs font-medium text-[var(--accent-text)] mt-auto pt-2">
        View prompt →
      </span>
    </Link>
  )
}
