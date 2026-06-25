import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import 'react-tweet/theme.css'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Emadamerho-Atori Nefe — Content Marketer & SEO Manager',
    template: '%s | Nefe',
  },
  description:
    'Technical content writer and SEO manager with 4+ years of experience helping tech companies grow through content that earns top rankings and drives real results.',
  keywords: ['content marketer', 'SEO manager', 'technical writer', 'content strategy'],
  authors: [{ name: 'Emadamerho-Atori Nefe' }],
  verification: {
    google: 'GcQps8NnuJg7pln3rZQ2sGB1P8haOsu0iGWzI_CuUDU',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Emadamerho-Atori Nefe',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
