import { compile, run } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode, { type Options as PrettyCodeOptions } from 'rehype-pretty-code'
import { mdxComponents } from './MdxComponents'

// ─── Shared MDX renderer ──────────────────────────────────────────────────────
// One renderer for both the personal blog (/blog/[slug]) and portfolio articles
// (/portfolio/[client]/[slug]). Any improvement here — syntax highlighting,
// new components — benefits both. MDX is compiled at request time and run with
// the shared component map (see MdxComponents.tsx).

// Markdown turns a standalone image line into <p><img/></p>, but our img
// component renders a <figure> — invalid inside <p> and a hydration error.
// Unwrap paragraphs whose only content is an image so the figure sits at flow
// level. (hast nodes are loosely typed; structural walk is all we need.)
type HastNode = { type?: string; tagName?: string; value?: string; children?: HastNode[] }

function rehypeUnwrapImages() {
  return (tree: HastNode) => {
    const visit = (node: HastNode) => {
      if (!node.children) return
      node.children = node.children.map((child) => {
        if (child.tagName === 'p' && child.children) {
          const meaningful = child.children.filter(
            (c) => !(c.type === 'text' && !(c.value ?? '').trim()),
          )
          if (meaningful.length === 1 && meaningful[0].tagName === 'img') return meaningful[0]
        }
        return child
      })
      node.children.forEach(visit)
    }
    visit(tree)
  }
}

const prettyCodeOptions: PrettyCodeOptions = {
  // Dark theme to match the site's dark surfaces; block chrome is styled in
  // globals.css from the design tokens.
  theme: 'github-dark',
  keepBackground: false,
  // Untagged fences still get highlighted (as plain text) so every block has
  // the same figure wrapper, styling, and CodeBlock chrome. Block-only: a bare
  // string would also process inline code, breaking its prose styling.
  defaultLang: { block: 'plaintext' },
}

export default async function MdxContent({ content }: { content: string }) {
  const code = await compile(content, {
    outputFormat: 'function-body',
    // GFM enables pipe tables (used by imported Prismic comparison tables),
    // strikethrough, and autolinks.
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeUnwrapImages, [rehypePrettyCode, prettyCodeOptions]],
  })

  const { default: Content } = await run(code, {
    ...(runtime as Parameters<typeof run>[1]),
    baseUrl: import.meta.url,
  })

  return <Content components={mdxComponents} />
}
