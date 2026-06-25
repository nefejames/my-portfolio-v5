import Link from 'next/link'
import type { PostMeta } from '@/lib/posts'
import { formatDate } from '@/lib/utils'

export default function BlogCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col gap-3 p-6 bg-[var(--surface)] border border-[var(--border)] rounded-xl hover:border-[var(--accent-text)] hover:shadow-sm transition-all"
    >
      <div className="flex items-center justify-between">
        <time className="text-xs text-[var(--muted)]">{formatDate(post.date)}</time>
        {post.tags[0] && (
          <span className="text-xs font-medium px-2.5 py-1 bg-[var(--accent-subtle)] text-[var(--accent-text)] rounded-md">
            {post.tags[0]}
          </span>
        )}
      </div>
      <h2 className="text-base font-semibold text-[var(--text)] group-hover:text-[var(--accent-text)] transition-colors leading-snug">
        {post.title}
      </h2>
      <p className="text-sm text-[var(--muted)] leading-relaxed">{post.excerpt}</p>
      <span className="text-xs font-medium text-[var(--accent-text)] mt-auto pt-2">
        Read more →
      </span>
    </Link>
  )
}
