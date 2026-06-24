import { compile, run } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import rehypePrettyCode, { type Options as PrettyCodeOptions } from 'rehype-pretty-code'
import { mdxComponents } from './MdxComponents'

// ─── Shared MDX renderer ──────────────────────────────────────────────────────
// One renderer for both the personal blog (/blog/[slug]) and portfolio articles
// (/portfolio/[client]/[slug]). Any improvement here — syntax highlighting,
// new components — benefits both. MDX is compiled at request time and run with
// the shared component map (see MdxComponents.tsx).

const prettyCodeOptions: PrettyCodeOptions = {
  // Light theme to match the site's editorial, cream-background palette.
  theme: 'github-light',
  // We supply our own block styling in globals.css to match the design tokens.
  keepBackground: false,
}

export default async function MdxContent({ content }: { content: string }) {
  const code = await compile(content, {
    outputFormat: 'function-body',
    rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
  })

  const { default: Content } = await run(code, {
    ...(runtime as Parameters<typeof run>[1]),
    baseUrl: import.meta.url,
  })

  return <Content components={mdxComponents} />
}
