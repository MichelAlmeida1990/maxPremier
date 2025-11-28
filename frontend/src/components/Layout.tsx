import { useEffect, useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import AppTour, { hasCompletedTour, TourButton } from './AppTour'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [runTour, setRunTour] = useState(false)
  const [showTourButton, setShowTourButton] = useState(false)

  useEffect(() => {
    // Sempre mostrar o botão do tour (opcional)
    setShowTourButton(true)
  }, [])

  const handleStartTour = () => {
    setRunTour(true)
    setShowTourButton(false)
  }

  const handleTourComplete = () => {
    setShowTourButton(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 relative">
          {showTourButton && (
            <div className="fixed bottom-6 right-6 z-50">
              <TourButton onStart={handleStartTour} />
            </div>
          )}
          {children}
        </main>
      </div>
      <AppTour run={runTour} onComplete={handleTourComplete} />
    </div>
  )
}

