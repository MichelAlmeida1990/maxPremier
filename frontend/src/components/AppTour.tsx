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
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setRunTour(run)
    if (run) {
      setStepIndex(0)
      // Garantir que começamos na página de clientes
      if (location.pathname !== '/clients') {
        navigate('/clients')
      }
    }
  }, [run, navigate, location.pathname])

  const handleTourCallback = (data: CallBackProps) => {
    const { status, index, action } = data

    // Navegar entre páginas conforme o tour avança
    if (action === 'next') {
      const nextStep = completeTourSteps[index + 1]
      if (nextStep?.navigateTo) {
        setTimeout(() => {
          navigate(nextStep.navigateTo)
          // Aguardar um pouco para a página carregar antes de mostrar o próximo passo
          setTimeout(() => {
            setStepIndex(index + 1)
          }, 500)
        }, 300)
        return // Não atualizar stepIndex aqui, será atualizado após navegação
      }
      setStepIndex(index + 1)
    } else if (action === 'prev') {
      const prevStep = completeTourSteps[index - 1]
      if (prevStep?.navigateTo) {
        setTimeout(() => {
          navigate(prevStep.navigateTo)
          setTimeout(() => {
            setStepIndex(index - 1)
          }, 500)
        }, 300)
        return
      }
      setStepIndex(index - 1)
    }

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      markTourAsCompleted()
      setRunTour(false)
      setStepIndex(0)
      if (onComplete) {
        onComplete()
      }
    }
  }

  const steps = completeTourSteps

  return (
    <Joyride
      steps={steps}
      run={runTour}
      stepIndex={stepIndex}
      continuous
      showProgress
      showSkipButton
      callback={handleTourCallback}
      disableScrolling={false}
      disableOverlayClose={false}
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

