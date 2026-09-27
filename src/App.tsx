import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence } from 'framer-motion'
import MapView from './components/MapView'
import Header from './components/Header'
import WelcomeModal from './components/WelcomeModal'
import AboutPage from './components/AboutPage'
import ToursModal from './components/ToursModal'
import type { View } from './types'
import type { TourConfig } from './tours.config'

interface ActiveTour {
  tour: TourConfig
  stepIndex: number
}

export default function App() {
  const { i18n } = useTranslation()
  const [view, setView] = useState<View>('map')
  const [showWelcome, setShowWelcome] = useState(false)
  const [showToursModal, setShowToursModal] = useState(false)
  const [activeTour, setActiveTour] = useState<ActiveTour | null>(null)

  useEffect(() => {
    const seen = sessionStorage.getItem('bsb_welcomed')
    if (!seen) setShowWelcome(true)
  }, [])

  const handleDismissWelcome = () => {
    sessionStorage.setItem('bsb_welcomed', '1')
    setShowWelcome(false)
  }

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr')
  }

  const handleNavigate = (v: View) => {
    if (v === 'tours') {
      setShowToursModal(true)
    } else {
      setView(v)
    }
  }

  const handleStartTour = useCallback((tour: TourConfig, stepIndex: number) => {
    setActiveTour({ tour, stepIndex })
    setView('map')
  }, [])

  const handleTourNext = useCallback(() => {
    setActiveTour(prev => {
      if (!prev) return null
      const next = prev.stepIndex + 1
      if (next >= prev.tour.steps.length) return null
      return { ...prev, stepIndex: next }
    })
  }, [])

  const handleTourPrev = useCallback(() => {
    setActiveTour(prev => {
      if (!prev || prev.stepIndex === 0) return prev
      return { ...prev, stepIndex: prev.stepIndex - 1 }
    })
  }, [])

  const handleTourClose = useCallback(() => {
    setActiveTour(null)
  }, [])

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0a0f1e]">
      {/* Map always mounted */}
      <MapView
        visible={view === 'map'}
        activeTour={activeTour}
        onTourNext={handleTourNext}
        onTourPrev={handleTourPrev}
        onTourClose={handleTourClose}
      />

      <Header
        currentView={view}
        onNavigate={handleNavigate}
        onToggleLang={toggleLang}
        activeTour={!!activeTour}
      />

      <AnimatePresence>
        {view === 'about' && (
          <div
            className="absolute inset-0 top-14 z-30 overflow-y-auto"
          >
            <AboutPage onClose={() => setView('map')} />
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showToursModal && (
          <ToursModal
            onClose={() => setShowToursModal(false)}
            onStartTour={handleStartTour}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showWelcome && (
          <WelcomeModal onClose={handleDismissWelcome} />
        )}
      </AnimatePresence>
    </div>
  )
}
