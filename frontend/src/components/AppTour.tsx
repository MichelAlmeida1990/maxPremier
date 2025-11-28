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
  const [isReady, setIsReady] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (run) {
      setStepIndex(0)
      setIsNavigating(false)
      setIsReady(false)
      
      // Garantir que começamos na página de clientes
      if (location.pathname !== '/clients') {
        setIsNavigating(true)
        navigate('/clients')
        // Aguardar a página carregar antes de iniciar o tour
        setTimeout(() => {
          setIsNavigating(false)
          // Aguardar mais um pouco para garantir que elementos estão montados
          setTimeout(() => {
            setIsReady(true)
            setRunTour(true)
          }, 500)
        }, 800)
      } else {
        // Já está na página correta, aguardar elementos carregarem
        setTimeout(() => {
          setIsReady(true)
          setRunTour(true)
        }, 500)
      }
    } else {
      setRunTour(false)
      setIsReady(false)
    }
  }, [run, navigate, location.pathname])

  // Função para verificar se um elemento existe e está visível
  const checkElementExists = (selector: string): boolean => {
    if (selector === 'body') return true
    try {
      const element = document.querySelector(selector)
      if (!element) return false
      
      // Verificar se o elemento está no DOM e visível
      if (!document.body.contains(element)) return false
      
      const rect = element.getBoundingClientRect()
      const style = window.getComputedStyle(element)
      
      return (
        rect.width >= 0 &&
        rect.height >= 0 &&
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        parseFloat(style.opacity) > 0
      )
    } catch {
      return false
    }
  }

  // Aguardar elemento aparecer
  const waitForElement = (selector: string, timeout = 5000): Promise<boolean> => {
    return new Promise((resolve) => {
      // Verificar imediatamente
      if (checkElementExists(selector)) {
        resolve(true)
        return
      }

      let resolved = false
      let attempts = 0
      const maxAttempts = timeout / 200
      
      const checkAndResolve = () => {
        if (resolved) return
        attempts++
        if (checkElementExists(selector)) {
          resolved = true
          clearInterval(interval)
          observer.disconnect()
          resolve(true)
        } else if (attempts >= maxAttempts) {
          resolved = true
          clearInterval(interval)
          observer.disconnect()
          resolve(false)
        }
      }

      const interval = setInterval(checkAndResolve, 200)

      const observer = new MutationObserver(() => {
        checkAndResolve()
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class', 'data-tour'],
      })

      setTimeout(() => {
        if (!resolved) {
          resolved = true
          clearInterval(interval)
          observer.disconnect()
          resolve(checkElementExists(selector))
        }
      }, timeout)
    })
  }

  const handleTourCallback = async (data: CallBackProps) => {
    const { status, index, action, type } = data

    // Ignorar eventos internos do joyride
    if (type === 'step:after' || type === 'tour:start') {
      return
    }

    // Navegar entre páginas conforme o tour avança
    if (action === 'next') {
      const nextStep = completeTourSteps[index + 1]
      if (!nextStep) {
        return
      }

      // Se precisa navegar para outra página
      if (nextStep.navigateTo && nextStep.navigateTo !== location.pathname) {
        setIsNavigating(true)
        setRunTour(false) // Pausar tour durante navegação
        
        // Navegar primeiro
        navigate(nextStep.navigateTo)
        
        // Aguardar a navegação completar e elementos carregarem
        setTimeout(async () => {
          // Aguardar React Router atualizar
          await new Promise(resolve => setTimeout(resolve, 300))
          
          if (nextStep.target && nextStep.target !== 'body') {
            const exists = await waitForElement(nextStep.target as string, 4000)
            setIsNavigating(false)
            setStepIndex(index + 1)
            // Aguardar um pouco mais antes de retomar o tour
            setTimeout(() => {
              setRunTour(true)
            }, 200)
          } else {
            // Elemento é body ou não especificado
            setIsNavigating(false)
            setStepIndex(index + 1)
            setTimeout(() => {
              setRunTour(true)
            }, 300)
          }
        }, 600)
      } else {
        // Mesma página, verificar se elemento existe antes de avançar
        if (nextStep.target && nextStep.target !== 'body') {
          const exists = await waitForElement(nextStep.target as string, 2000)
          if (exists) {
            setStepIndex(index + 1)
          } else {
            // Elemento não encontrado, pular este passo
            console.warn(`Elemento não encontrado: ${nextStep.target}, pulando passo`)
            setStepIndex(index + 1)
          }
        } else {
          setStepIndex(index + 1)
        }
      }
    } else if (action === 'prev') {
      const prevStep = completeTourSteps[index - 1]
      if (prevStep?.navigateTo && prevStep.navigateTo !== location.pathname) {
        setIsNavigating(true)
        setRunTour(false)
        navigate(prevStep.navigateTo)
        setTimeout(() => {
          setIsNavigating(false)
          setStepIndex(index - 1)
          setTimeout(() => setRunTour(true), 100)
        }, 500)
      } else {
        setStepIndex(index - 1)
      }
    }

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      markTourAsCompleted()
      setRunTour(false)
      setStepIndex(0)
      setIsNavigating(false)
      setIsReady(false)
      if (onComplete) {
        onComplete()
      }
    }
  }

  const steps = completeTourSteps

  // Não mostrar o tour enquanto estiver navegando ou não estiver pronto
  if (isNavigating || !isReady) {
    return null
  }

  return (
    <Joyride
      steps={steps}
      run={runTour && !isNavigating && isReady}
      stepIndex={stepIndex}
      continuous
      showProgress
      showSkipButton
      callback={handleTourCallback}
      disableScrolling={false}
      disableOverlayClose={false}
      spotlightClicks={false}
      disableCloseOnEsc={false}
      floaterProps={{
        disableAnimation: true,
      }}
      styles={{
        options: {
          primaryColor: '#00afee',
          textColor: '#031f5f',
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

