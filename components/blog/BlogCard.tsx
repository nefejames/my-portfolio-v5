import Link from 'next/link'
import type { PostMeta } from '@/lib/posts'
import { formatDate } from '@/lib/utils'

const sharedClass =
  'group relative flex flex-col gap-3 p-6 min-h-[180px] bg-[var(--surface)] border border-[var(--border)] rounded-xl hover:border-[var(--accent-text)] hover:shadow-sm transition-all text-left w-full'

interface BlogCardProps {
  post: PostMeta
  onTeaser?: () => void
}

export default function BlogCard({ post, onTeaser }: BlogCardProps) {
  const inner = (
    <>
      <div className="flex items-center justify-between">
        <time className="text-xs text-[var(--muted)]">{formatDate(post.date)}</time>
        {post.tags[0] && (
          <span className="text-xs font-medium px-2.5 py-1 bg-[var(--accent-subtle)] text-[var(--accent-text)] rounded-md">
            {post.tags[0]}
          </span>
        )}
      </div>

      <h2 className={`text-base font-semibold text-[var(--text)] group-hover:text-[var(--accent-text)] transition-colors leading-snug${onTeaser ? ' pb-8' : ''}`}>
        {post.title}
      </h2>

      {onTeaser ? (
        <span className="absolute bottom-6 right-6 text-xs font-semibold tracking-wide uppercase px-2.5 py-1 bg-[var(--text)] text-[var(--bg)] rounded-md">
          Coming soon
        </span>
      ) : (
        <span className="text-xs font-medium text-[var(--accent-text)] mt-auto pt-2">
          Read more →
        </span>
      )}
    </>
  )

  if (onTeaser) {
    return (
      <button className={sharedClass} onClick={onTeaser}>
        {inner}
      </button>
    )
  }

  return (
    <Link href={`/blog/${post.slug}`} className={sharedClass}>
      {inner}
    </Link>
  )
}
