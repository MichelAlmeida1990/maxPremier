import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride'
import { HelpCircle } from 'lucide-react'
import { dashboardSteps, checklistsSteps, visitsSteps, clientsSteps } from './TourSteps'

interface AppTourProps {
  run?: boolean
  onComplete?: () => void
}

const TOUR_STORAGE_KEY = 'maxpremier-tour-completed'

export function hasCompletedTour(): boolean {
  return localStorage.getItem(TOUR_STORAGE_KEY) === 'true'
}

export function markTourAsCompleted(): void {
  localStorage.setItem(TOUR_STORAGE_KEY, 'true')
}

export function resetTour(): void {
  localStorage.removeItem(TOUR_STORAGE_KEY)
}

export default function AppTour({ run = false, onComplete }: AppTourProps) {
  const [runTour, setRunTour] = useState(run)
  const location = useLocation()

  useEffect(() => {
    setRunTour(run)
  }, [run])

  // Selecionar os passos baseado na página atual
  const getStepsForPage = (): Step[] => {
    switch (location.pathname) {
      case '/':
        return dashboardSteps
      case '/checklists':
        return checklistsSteps
      case '/visits':
        return visitsSteps
      case '/clients':
        return clientsSteps
      default:
        return dashboardSteps
    }
  }

  const handleTourCallback = (data: CallBackProps) => {
    const { status } = data

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      markTourAsCompleted()
      setRunTour(false)
      if (onComplete) {
        onComplete()
      }
    }
  }

  const steps = getStepsForPage()

  return (
    <Joyride
      steps={steps}
      run={runTour}
      continuous
      showProgress
      showSkipButton
      callback={handleTourCallback}
      styles={{
        options: {
          primaryColor: '#00afee', // maxpremier-blue-bright
          textColor: '#031f5f', // maxpremier-blue-dark
          backgroundColor: '#ffffff',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
          arrowColor: '#ffffff',
        },
        tooltip: {
          borderRadius: 8,
          padding: 20,
        },
        buttonNext: {
          backgroundColor: '#00afee',
          color: '#ffffff',
          borderRadius: 6,
          padding: '10px 20px',
          fontSize: 14,
          fontWeight: 600,
        },
        buttonBack: {
          color: '#031f5f',
          marginRight: 10,
          fontSize: 14,
        },
        buttonSkip: {
          color: '#666',
          fontSize: 14,
        },
      }}
      locale={{
        back: 'Voltar',
        close: 'Fechar',
        last: 'Finalizar',
        next: 'Próximo',
        skip: 'Pular',
      }}
    />
  )
}

export function TourButton({ onStart }: { onStart: () => void }) {
  return (
    <button
      onClick={onStart}
      className="flex items-center space-x-2 px-4 py-2 bg-maxpremier-blue-bright text-white rounded-lg hover:opacity-90 transition-opacity"
      title="Iniciar tour guiado"
    >
      <HelpCircle size={18} />
      <span>Tour Guiado</span>
    </button>
  )
}

