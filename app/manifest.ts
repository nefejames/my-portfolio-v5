import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/site'

// Web app manifest — completes the technical-SEO baseline (installability
// signals, correct name/description/brand color when the site is saved).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: 'Nefe',
    description: SITE.description,
    start_url: '/',
    display: 'browser',
    background_color: '#0F0F12',
    theme_color: '#4F46E5',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon',
      },
    ],
  }
}
