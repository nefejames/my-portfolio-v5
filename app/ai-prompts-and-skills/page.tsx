import type { Metadata } from 'next'
import { getAllPrompts } from '@/lib/prompts'
import { SITE } from '@/lib/site'
import PromptList from '@/components/prompts/PromptList'

const title = 'Prompt & Skill Library — AI Prompts and Claude Skills'
const description =
  `A free, growing library of the AI prompts and Claude skills ${SITE.name} uses for content writing, blog outlines, LinkedIn posts, and image creation. Copy and use them.`

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/ai-prompts-and-skills' },
  openGraph: {
    type: 'website',
    url: '/ai-prompts-and-skills',
    title,
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
}

export default async function PromptLibraryPage() {
  const prompts = await getAllPrompts()

  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 pb-24">
      <div className="mb-12">
        <p className="text-xs font-semibold tracking-widest uppercase text-[var(--accent-text)] mb-4">
          Prompt &amp; Skill Library
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-6">
          Prompts &amp; skills I actually use
        </h1>
        <p className="text-lg text-[var(--muted)] max-w-xl">
          The AI prompts and Claude skills behind my content workflow — for blog outlines,
          LinkedIn posts, image generation, and more. Free to copy. I add new ones as I
          experiment.
        </p>
      </div>

      <PromptList prompts={prompts} />
    </div>
  )
}
