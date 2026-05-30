import { Footer } from '../sections/Footer'
import { HeroSection } from '../sections/HeroSection'
import { ShowcaseSection } from '../sections/ShowcaseSection'
import { DemoSection } from '../sections/DemoSection'
import { TrailerSection } from '../sections/TrailerSection'

export function LandingPage() {
  return (
    <>
      <main>
        <HeroSection />
        <TrailerSection />
        <ShowcaseSection />
        <DemoSection />
      </main>
      <Footer />
    </>
  )
}

