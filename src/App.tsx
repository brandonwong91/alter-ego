import { Atmosphere } from './components/layout/Atmosphere'
import { HeaderNav } from './components/layout/HeaderNav'
import { Footer } from './sections/Footer'
import { HeroSection } from './sections/HeroSection'
import { ShowcaseSection } from './sections/ShowcaseSection'
import { DemoSection } from './sections/DemoSection'
import { TrailerSection } from './sections/TrailerSection'

function App() {
  return (
    <div className="min-h-[100svh] overflow-x-clip">
      <Atmosphere />
      <HeaderNav />
      <main>
        <HeroSection />
        <TrailerSection />
        <ShowcaseSection />
        <DemoSection />
      </main>
      <Footer />
    </div>
  )
}

export default App
