import Link from 'next/link'
import { PostMeta, formatDate } from '@/lib/posts'

export default function BlogCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col gap-3 p-6 bg-white border border-[#E5E7EB] rounded-xl hover:border-[#4F46E5] hover:shadow-sm transition-all"
    >
      <div className="flex items-center justify-between">
        <time className="text-xs text-[#6B7280]">{formatDate(post.date)}</time>
        {post.tags[0] && (
          <span className="text-xs font-medium px-2.5 py-1 bg-[#EEF2FF] text-[#4F46E5] rounded-md">
            {post.tags[0]}
          </span>
        )}
      </div>
      <h2 className="text-base font-semibold text-[#111827] group-hover:text-[#4F46E5] transition-colors leading-snug">
        {post.title}
      </h2>
      <p className="text-sm text-[#6B7280] leading-relaxed">{post.excerpt}</p>
      <span className="text-xs font-medium text-[#4F46E5] mt-auto pt-2">
        Read more →
      </span>
    </Link>
  )
}
