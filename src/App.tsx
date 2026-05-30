import { Routes, Route } from 'react-router-dom'

import { Atmosphere } from './components/layout/Atmosphere'
import { HeaderNav } from './components/layout/HeaderNav'
import { GamePage } from './pages/GamePage'
import { LandingPage } from './pages/LandingPage'

function App() {
  return (
    <div className="min-h-[100svh] overflow-x-clip">
      <Atmosphere />
      <HeaderNav />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </div>
  )
}

export default App
