import type { Metadata } from 'next'
import { Fraunces, Hanken_Grotesk, Geist_Mono } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SplashScreen from '@/components/SplashScreen'
import JsonLd from '@/components/JsonLd'
import { SITE } from '@/lib/site'
import './globals.css'

// Typography (matches sendbyte.africa): Fraunces serif for headings/display,
// Hanken Grotesk sans for body/UI, Geist Mono for code.
const fraunces = Fraunces({ variable: '--font-fraunces', subsets: ['latin'], display: 'swap' })
const hanken = Hanken_Grotesk({ variable: '--font-hanken', subsets: ['latin'], display: 'swap' })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  // metadataBase lets every relative canonical / OG URL resolve to an absolute
  // one, and silences the Next.js build warning about social image URLs.
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: '%s | Nefe',
  },
  description: SITE.description,
  keywords: ['content marketer', 'SEO manager', 'technical writer', 'content strategy'],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  alternates: {
    canonical: '/',
  },
  verification: {
    google: 'GcQps8NnuJg7pln3rZQ2sGB1P8haOsu0iGWzI_CuUDU',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    siteName: SITE.name,
    url: SITE.url,
    title: SITE.title,
    description: SITE.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.title,
    description: SITE.description,
  },
}

// Site-wide structured data: who the author is, and the site itself. Page-level
// schema (BlogPosting, Article, BreadcrumbList) is added in each route.
// Stable @id so other schema (e.g. the homepage ProfilePage) can reference this
// one Person entity instead of duplicating it.
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE.url}/#person`,
  name: SITE.name,
  url: SITE.url,
  email: `mailto:${SITE.email}`,
  jobTitle: SITE.jobTitle,
  description: SITE.description,
  sameAs: [SITE.social.linkedin],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE.url}/#website`,
  name: SITE.name,
  url: SITE.url,
  author: { '@id': `${SITE.url}/#person` },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: scoped to this element's attributes — the
    // pre-paint splash script legitimately adds data-splash-seen before React
    // hydrates, which would otherwise log a mismatch on every repeat view.
    <html
      lang="en"
      className={`${hanken.variable} ${fraunces.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col">
        {/* Runs before first paint: repeat visitors this session skip the
            splash curtain entirely (CSS hides it via the html attribute),
            so hydration never flashes it. Key must match SplashScreen. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem('nea-splash-seen'))document.documentElement.setAttribute('data-splash-seen','')}catch{}`,
          }}
        />
        <SplashScreen />
        <JsonLd data={[personSchema, websiteSchema]} />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
