import Hero from '@/components/sections/Hero'
import Clients from '@/components/sections/Clients'
import Services from '@/components/sections/Services'
import Results from '@/components/sections/Results'
import SelectedWork from '@/components/sections/SelectedWork'
import BlogPreview from '@/components/sections/BlogPreview'
import About from '@/components/sections/About'
import Faq from '@/components/sections/Faq'
import Contact from '@/components/sections/Contact'
import JsonLd from '@/components/JsonLd'
import SplashScreen from '@/components/SplashScreen'
import { SITE } from '@/lib/site'

// Types the homepage as a personal profile and links it to the site-wide Person
// entity (defined in app/layout.tsx) for stronger author/E-E-A-T signals.
const profilePageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  url: SITE.url,
  mainEntity: { '@id': `${SITE.url}/#person` },
}

export default function Home() {
  return (
    <>
      {/* Plays the signature intro on every homepage visit (see SplashScreen). */}
      <SplashScreen />
      <JsonLd data={profilePageSchema} />
      <Hero />
      <Clients />
      <Services />
      <Results />
      <SelectedWork />
      <BlogPreview />
      <About />
      <Faq />
      <Contact />
    </>
  )
}
