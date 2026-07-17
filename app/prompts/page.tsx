import type { Metadata } from 'next'
import { getAllPrompts } from '@/lib/prompts'
import PromptList from '@/components/prompts/PromptList'

const title = 'Prompt Library — AI Prompts for Content Creators'
const description =
  'A curated library of AI prompts Emadamerho-Atori Nefe uses for content writing, blog outlines, LinkedIn posts, and LinkedIn image creation. Free to copy and use.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/prompts' },
  openGraph: {
    type: 'website',
    url: '/prompts',
    title,
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
}

export default async function PromptsPage() {
  const prompts = await getAllPrompts()

  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 pb-24">
      <div className="mb-12">
        <p className="text-xs font-semibold tracking-widest uppercase text-[var(--accent-text)] mb-4">
          Prompt Library
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-6">
          Prompts I actually use
        </h1>
        <p className="text-lg text-[var(--muted)] max-w-xl">
          The AI prompts behind my content workflow — for blog outlines, LinkedIn posts,
          image generation, and more. Free to copy. I add new ones as I experiment.
        </p>
      </div>

      <PromptList prompts={prompts} />
    </div>
  )
}
