import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllPrompts, getPromptBySlug, formatDate } from '@/lib/prompts'
import { SITE, absoluteUrl } from '@/lib/site'
import JsonLd from '@/components/JsonLd'
import CopyPromptButton from '@/components/prompts/CopyPromptButton'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const prompts = await getAllPrompts()
  return prompts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const prompt = await getPromptBySlug(slug)
  if (!prompt) return {}

  const url = `/prompts/${prompt.slug}`
  return {
    title: prompt.title,
    description: prompt.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: prompt.title,
      description: prompt.description,
      publishedTime: new Date(prompt.dateAdded).toISOString(),
      authors: [SITE.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: prompt.title,
      description: prompt.description,
    },
  }
}

export default async function PromptPage({ params }: Props) {
  const { slug } = await params
  const prompt = await getPromptBySlug(slug)
  if (!prompt) notFound()

  const url = absoluteUrl(`/prompts/${prompt.slug}`)

  // HowTo: signals to search + AI engines that this page is a usable resource.
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: prompt.title,
    description: prompt.description,
    author: { '@type': 'Person', name: SITE.name, url: SITE.url },
    datePublished: new Date(prompt.dateAdded).toISOString(),
    step: [
      { '@type': 'HowToStep', name: 'Copy the prompt', text: `Copy the ${prompt.title} prompt from this page.` },
      { '@type': 'HowToStep', name: 'Paste into your AI tool', text: 'Paste the prompt into Claude, ChatGPT, or your preferred AI assistant.' },
      { '@type': 'HowToStep', name: 'Customize and use', text: 'Replace any placeholder variables with your specific content and run the prompt.' },
    ],
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
      { '@type': 'ListItem', position: 2, name: 'Prompts', item: absoluteUrl('/prompts') },
      { '@type': 'ListItem', position: 3, name: prompt.title, item: url },
    ],
  }

  return (
    <>
      <JsonLd data={[howToSchema, breadcrumbSchema]} />

      <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-10 text-sm text-[var(--muted)]">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/" className="hover:text-[var(--accent-text)] transition-colors">Home</Link></li>
            <li aria-hidden className="text-[var(--faint)]">/</li>
            <li><Link href="/prompts" className="hover:text-[var(--accent-text)] transition-colors">Prompts</Link></li>
            <li aria-hidden className="text-[var(--faint)]">/</li>
            <li className="text-[var(--text)]">{prompt.title}</li>
          </ol>
        </nav>

        <header className="mb-8">
          <span className="inline-block text-xs font-medium px-2.5 py-1 bg-[var(--accent-subtle)] text-[var(--accent-text)] rounded-md mb-4">
            {prompt.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text)] leading-tight mb-3">
            {prompt.title}
          </h1>
          <p className="text-sm text-[var(--muted)]">Added {formatDate(prompt.dateAdded)}</p>
        </header>

        {/* How to use — shown prominently above the prompt */}
        <div className="mb-8 px-5 py-4 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl">
          <p className="text-xs font-semibold tracking-widest uppercase text-[var(--accent-text)] mb-2">
            How to use this prompt
          </p>
          <p className="text-[var(--muted)] leading-relaxed">{prompt.description}</p>
        </div>

        {/* The prompt — verbatim, with a copy button. Not MDX-compiled, so
            {variables} and <placeholders> render exactly as written. */}
        <div className="rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-[var(--surface-2)] border-b border-[var(--border)]">
            <span className="text-xs font-medium text-[var(--muted)]">Prompt</span>
            <CopyPromptButton text={prompt.content} />
          </div>
          <pre className="p-5 overflow-x-auto whitespace-pre-wrap break-words text-sm leading-relaxed text-[var(--text)] bg-[var(--surface)] font-mono">
            {prompt.content}
          </pre>
        </div>

        <footer className="mt-16 pt-8 border-t border-[var(--border)]">
          <Link
            href="/prompts"
            className="text-sm font-medium text-[var(--accent-text)] hover:underline"
          >
            ← Back to the prompt library
          </Link>
        </footer>
      </div>
    </>
  )
}
