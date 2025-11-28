import { useEffect, useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import AppTour, { TourButton } from './AppTour'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [runTour, setRunTour] = useState(false)
  const [showTourButton, setShowTourButton] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header onMenuToggle={toggleMobileMenu} isMenuOpen={isMobileMenuOpen} />
      <div className="flex relative">
        <Sidebar isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
        <main className="flex-1 p-4 sm:p-6 relative min-w-0 max-w-full">
          {showTourButton && (
            <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
              <TourButton onStart={handleStartTour} />
            </div>
          )}
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <AppTour run={runTour} onComplete={handleTourComplete} />
    </div>
  )
}

