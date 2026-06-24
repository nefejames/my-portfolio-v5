import Link from 'next/link'
import Image from 'next/image'
import type { PortfolioMeta } from '@/lib/portfolio'
import { formatDate } from '@/lib/utils'

export default function PortfolioCard({ article }: { article: PortfolioMeta }) {
  return (
    <Link
      href={`/portfolio/${article.clientSlug}/${article.slug}`}
      className="group flex flex-col bg-white border border-[#E5E7EB] rounded-xl overflow-hidden hover:border-[#4F46E5] hover:shadow-sm transition-all"
    >
      {article.coverImage && (
        <div className="relative aspect-[16/9] bg-[#F3F4F6] overflow-hidden">
          <Image
            src={article.coverImage}
            alt=""
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="flex flex-col gap-3 p-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#4F46E5]">{article.client}</span>
          <time className="text-xs text-[#6B7280]">{formatDate(article.publishedAt)}</time>
        </div>
        <h2 className="text-base font-semibold text-[#111827] group-hover:text-[#4F46E5] transition-colors leading-snug">
          {article.title}
        </h2>
        <p className="text-sm text-[#6B7280] leading-relaxed">{article.excerpt}</p>
        <span className="text-xs font-medium text-[#4F46E5] mt-auto pt-2">Read article →</span>
      </div>
    </Link>
  )
}
