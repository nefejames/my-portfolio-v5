import 'server-only'
import fs from 'fs'
import path from 'path'

export interface ClientBrand {
  /** kebab-case id; also the logo filename (e.g. "altexsoft" → altexsoft.svg) */
  slug: string
  name: string
}

// Brands shown in the homepage "Brands I've worked for" strip, in display order.
export const CLIENTS: ClientBrand[] = [
  { slug: 'logrocket', name: 'LogRocket' },
  { slug: 'smashing-magazine', name: 'Smashing Magazine' },
  { slug: 'prismic', name: 'Prismic' },
  { slug: 'altexsoft', name: 'AltexSoft' },
  { slug: 'strapi', name: 'Strapi' },
  { slug: 'buttercms', name: 'ButterCMS' },
  { slug: 'dojah', name: 'Dojah' },
  { slug: 'loginradius', name: 'LoginRadius' },
  { slug: 'bird-eats-bug', name: 'Bird Eats Bug' },
]

const LOGO_DIR = path.join(process.cwd(), 'public', 'logos', 'clients')
const EXTS = ['svg', 'png', 'webp'] as const

/**
 * Public path to a client's wordmark logo if the asset exists, else null.
 * Drop a file named `<slug>.svg` (or .png/.webp) into public/logos/clients/
 * and it is picked up automatically — no code change needed.
 */
export function clientLogo(slug: string): string | null {
  for (const ext of EXTS) {
    if (fs.existsSync(path.join(LOGO_DIR, `${slug}.${ext}`))) {
      return `/logos/clients/${slug}.${ext}`
    }
  }
  return null
}
