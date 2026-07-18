import Link from 'next/link'
import type { PromptMeta } from '@/lib/prompts'

// One item (prompt or skill) in the library grid. The whole card links to its
// page — copy lives there, not here. Mirrors the blog/portfolio card styling.
export default function PromptCard({ prompt }: { prompt: PromptMeta }) {
  const isSkill = prompt.type === 'Skill'
  return (
    <Link
      href={`/ai-prompts-and-skills/${prompt.slug}`}
      className="group flex flex-col gap-3 p-6 bg-[var(--surface)] border border-[var(--border)] rounded-xl hover:border-[var(--accent-text)] hover:shadow-sm transition-all"
    >
      <div className="flex flex-wrap items-center gap-2">
        {/* Type badge — solid accent for skills, subtle for prompts, so the two
            kinds are distinguishable at a glance. */}
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
            isSkill
              ? 'bg-[var(--accent)] text-white'
              : 'border border-[var(--border)] text-[var(--muted)]'
          }`}
        >
          {prompt.type}
        </span>
        <span className="text-xs font-medium px-2.5 py-1 bg-[var(--accent-subtle)] text-[var(--accent-text)] rounded-md">
          {prompt.category}
        </span>
      </div>
      <h2 className="text-base font-semibold text-[var(--text)] group-hover:text-[var(--accent-text)] transition-colors leading-snug">
        {prompt.title}
      </h2>
      <p className="text-sm text-[var(--muted)] leading-relaxed">{prompt.description}</p>
      <span className="text-xs font-medium text-[var(--accent-text)] mt-auto pt-2">
        {isSkill ? 'View skill →' : 'View prompt →'}
      </span>
    </Link>
  )
}
