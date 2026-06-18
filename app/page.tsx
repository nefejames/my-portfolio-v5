import Hero from '@/components/sections/Hero'
import Clients from '@/components/sections/Clients'
import Services from '@/components/sections/Services'
import Results from '@/components/sections/Results'
import SelectedWork from '@/components/sections/SelectedWork'
import BlogPreview from '@/components/sections/BlogPreview'
import About from '@/components/sections/About'
import Contact from '@/components/sections/Contact'

export default function Home() {
  return (
    <>
      <Hero />
      <Clients />
      <Services />
      <Results />
      <SelectedWork />
      <BlogPreview />
      <About />
      <Contact />
    </>
  )
}
