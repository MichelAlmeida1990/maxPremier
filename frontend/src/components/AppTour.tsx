import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride'
import { HelpCircle } from 'lucide-react'
import { completeTourSteps } from './TourSteps'

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
  const [stepIndex, setStepIndex] = useState(0)
  const [isNavigating, setIsNavigating] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setRunTour(run)
    if (run) {
      setStepIndex(0)
      setIsNavigating(false)
      // Garantir que começamos na página de clientes
      if (location.pathname !== '/clients') {
        setIsNavigating(true)
        navigate('/clients')
        // Aguardar a página carregar antes de iniciar o tour
        setTimeout(() => {
          setIsNavigating(false)
        }, 800)
      }
    }
  }, [run, navigate, location.pathname])

  // Função para verificar se um elemento existe
  const checkElementExists = (selector: string): boolean => {
    if (selector === 'body') return true
    try {
      const element = document.querySelector(selector)
      return element !== null
    } catch {
      return false
    }
  }

  const handleTourCallback = (data: CallBackProps) => {
    const { status, index, action } = data

    // Navegar entre páginas conforme o tour avança
    if (action === 'next') {
      const nextStep = completeTourSteps[index + 1]
      if (nextStep?.navigateTo && nextStep.navigateTo !== location.pathname) {
        setIsNavigating(true)
        navigate(nextStep.navigateTo)
        // Aguardar a navegação e verificar se o elemento existe
        const checkAndAdvance = () => {
          setTimeout(() => {
            if (nextStep.target && checkElementExists(nextStep.target as string)) {
              setIsNavigating(false)
              setStepIndex(index + 1)
            } else if (nextStep.target === 'body') {
              setIsNavigating(false)
              setStepIndex(index + 1)
            } else {
              // Tentar novamente após mais um delay
              setTimeout(checkAndAdvance, 300)
            }
          }, 600)
        }
        checkAndAdvance()
      } else {
        // Verificar se o elemento existe antes de avançar
        const currentStep = completeTourSteps[index + 1]
        if (currentStep?.target && checkElementExists(currentStep.target as string)) {
          setStepIndex(index + 1)
        } else if (!currentStep?.target || currentStep.target === 'body') {
          setStepIndex(index + 1)
        } else {
          // Aguardar um pouco e tentar novamente
          setTimeout(() => {
            if (currentStep?.target && checkElementExists(currentStep.target as string)) {
              setStepIndex(index + 1)
            } else {
              setStepIndex(index + 1) // Avançar mesmo assim
            }
          }, 500)
        }
      }
    } else if (action === 'prev') {
      const prevStep = completeTourSteps[index - 1]
      if (prevStep?.navigateTo && prevStep.navigateTo !== location.pathname) {
        setIsNavigating(true)
        navigate(prevStep.navigateTo)
        setTimeout(() => {
          setIsNavigating(false)
          setStepIndex(index - 1)
        }, 600)
      } else {
        setStepIndex(index - 1)
      }
    }

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      markTourAsCompleted()
      setRunTour(false)
      setStepIndex(0)
      setIsNavigating(false)
      if (onComplete) {
        onComplete()
      }
    }
  }

  const steps = completeTourSteps

  // Não mostrar o tour enquanto estiver navegando
  if (isNavigating) {
    return null
  }

  return (
    <Joyride
      steps={steps}
      run={runTour && !isNavigating}
      stepIndex={stepIndex}
      continuous
      showProgress
      showSkipButton
      callback={handleTourCallback}
      disableScrolling={false}
      disableOverlayClose={false}
      spotlightClicks={false}
      floaterProps={{
        disableAnimation: false,
      }}
      styles={{
        options: {
          primaryColor: '#00afee', // maxpremier-blue-bright
          textColor: '#031f5f', // maxpremier-blue-dark
          backgroundColor: '#ffffff',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
          arrowColor: '#ffffff',
          zIndex: 10000,
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

