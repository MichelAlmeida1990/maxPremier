import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Joyride, { CallBackProps, STATUS } from 'react-joyride'
import { HelpCircle } from 'lucide-react'
import { completeTourSteps } from './TourSteps'
import { markTourAsCompleted } from '../utils/tourUtils'

interface AppTourProps {
  run?: boolean
  onComplete?: () => void
}

export default function AppTour({ run = false, onComplete }: AppTourProps) {
  const [runTour, setRunTour] = useState(run)
  const [stepIndex, setStepIndex] = useState(0)
  const [isNavigating, setIsNavigating] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Inicializar tour apenas quando 'run' muda de false para true
  useEffect(() => {
    if (run) {
      // Só inicializar se o tour não estiver rodando e não estiver navegando
      if (!runTour && !isNavigating && stepIndex === 0) {
        console.log('[EFFECT] Iniciando tour, resetando stepIndex para 0')
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
              console.log('[EFFECT] Tour pronto para iniciar')
            }, 500)
          }, 800)
        } else {
          // Já está na página correta, aguardar elementos carregarem
          setTimeout(() => {
            setIsReady(true)
            setRunTour(true)
            console.log('[EFFECT] Tour pronto para iniciar (já na página correta)')
          }, 500)
        }
      }
    } else {
      setRunTour(false)
      setIsReady(false)
    }
  }, [run]) // Removido location.pathname para não resetar durante navegação

  // Debug: log quando stepIndex muda
  useEffect(() => {
    console.log('[EFFECT] stepIndex mudou para:', stepIndex)
  }, [stepIndex])

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
    const { status, index, action, type, step } = data

    console.log('Tour callback:', { status, index, action, type, step: step?.target, pathname: location.pathname, stepIndex })

    // Quando o tour inicia
    if (type === 'tour:start') {
      console.log('Tour iniciado no índice', index)
      return
    }

    // Quando um passo está prestes a ser exibido
    if (type === 'step:before') {
      const currentStep = completeTourSteps[index]
      
      // Se precisa navegar para outra página antes de mostrar o passo
      if (currentStep?.navigateTo && currentStep.navigateTo !== location.pathname) {
        console.log(`[STEP:BEFORE] Navegando para ${currentStep.navigateTo} antes do passo ${index}`)
        setIsNavigating(true)
        setRunTour(false)
        navigate(currentStep.navigateTo)
        
        setTimeout(async () => {
          console.log(`[STEP:BEFORE] Aguardando página ${currentStep.navigateTo} carregar...`)
          // Aguardar React Router atualizar
          await new Promise(resolve => setTimeout(resolve, 500))
          
          if (currentStep.target && currentStep.target !== 'body') {
            const exists = await waitForElement(currentStep.target as string, 5000)
            console.log(`[STEP:BEFORE] Elemento ${currentStep.target} existe:`, exists)
          } else {
            await new Promise(resolve => setTimeout(resolve, 300))
          }
          setIsNavigating(false)
          setTimeout(() => {
            console.log(`[STEP:BEFORE] Retomando tour após navegação`)
            setRunTour(true)
          }, 400)
        }, 1200)
        return
      }
      
      // Verificar se elemento existe na página atual
      if (currentStep?.target && currentStep.target !== 'body') {
        const exists = await waitForElement(currentStep.target as string, 2000)
        if (!exists) {
          console.warn(`Elemento não encontrado: ${currentStep.target}, tentando continuar mesmo assim`)
        } else {
          console.log(`Elemento ${currentStep.target} encontrado e pronto`)
        }
      }
      return
    }

    // Quando um passo é concluído (step:after)
    if (type === 'step:after') {
      console.log(`[STEP:AFTER] Passo ${index} concluído, action: ${action}, status: ${status}`)
      
      // Quando action é 'next', precisamos avançar para o próximo passo
      if (action === 'next') {
        const nextStep = completeTourSteps[index + 1]
        
        if (!nextStep) {
          console.log(`[STEP:AFTER] Não há próximo passo, o tour vai terminar`)
          return
        }
        
        console.log(`[STEP:AFTER] Avançando para passo ${index + 1}`)
        
        // Se precisa navegar para outra página
        if (nextStep.navigateTo && nextStep.navigateTo !== location.pathname) {
          console.log(`[STEP:AFTER] Navegando para ${nextStep.navigateTo} (passo ${index + 1})`)
          setIsNavigating(true)
          setRunTour(false)
          const newIndex = index + 1
          
          // Navegar primeiro
          navigate(nextStep.navigateTo)
          
          setTimeout(async () => {
            console.log(`[STEP:AFTER] Aguardando página ${nextStep.navigateTo} carregar...`)
            // Aguardar React Router atualizar o pathname
            await new Promise(resolve => setTimeout(resolve, 500))
            
            // Verificar se o elemento existe (pode ser sidebar que existe em todas as páginas)
            if (nextStep.target && nextStep.target !== 'body') {
              const exists = await waitForElement(nextStep.target as string, 5000)
              console.log(`[STEP:AFTER] Elemento ${nextStep.target} existe:`, exists)
              if (!exists) {
                console.warn(`[STEP:AFTER] Elemento não encontrado após 5s, mas continuando mesmo assim`)
              }
            } else {
              // Aguardar um pouco mais para elementos do body
              await new Promise(resolve => setTimeout(resolve, 300))
            }
            
            // Atualizar stepIndex após navegação e elementos carregarem
            setStepIndex(newIndex)
            setIsNavigating(false)
            
            setTimeout(() => {
              console.log(`[STEP:AFTER] Retomando tour no passo ${newIndex}, pathname atual: ${location.pathname}`)
              setRunTour(true)
            }, 400)
          }, 1000)
        } else {
          // Mesma página, apenas avançar
          console.log(`[STEP:AFTER] Mesma página, atualizando stepIndex para ${index + 1}`)
          setStepIndex(index + 1)
        }
        return
      }
      
      // Se action é 'close' mas não deveria ser, pode ser um bug do Joyride
      // Vamos tratar como 'next' se não for o último passo
      if (action === 'close' && index < completeTourSteps.length - 1) {
        console.log(`[STEP:AFTER] Action 'close' detectado mas há próximo passo, tratando como 'next'`)
        const nextStep = completeTourSteps[index + 1]
        
        if (nextStep.navigateTo && nextStep.navigateTo !== location.pathname) {
          setIsNavigating(true)
          setRunTour(false)
          setStepIndex(index + 1)
          navigate(nextStep.navigateTo)
          setTimeout(async () => {
            if (nextStep.target && nextStep.target !== 'body') {
              await waitForElement(nextStep.target as string, 5000)
            }
            setIsNavigating(false)
            setTimeout(() => setRunTour(true), 400)
          }, 1000)
        } else {
          setStepIndex(index + 1)
        }
      }
      return
    }

    // Quando o usuário clica em próximo (já tratamos step:after acima)
    // Este bloco trata outros casos de 'next' que não sejam step:after
    if (action === 'next') {
      console.log(`[NEXT] Avançando do passo ${index} para ${index + 1}, stepIndex atual: ${stepIndex}`)
      const nextStep = completeTourSteps[index + 1]
      
      if (!nextStep) {
        console.log(`[NEXT] Não há próximo passo, o tour vai terminar`)
        return
      }

      // Com continuous=true, o Joyride gerencia o stepIndex automaticamente
      // Mas precisamos navegar se necessário ANTES do próximo passo aparecer
      if (nextStep.navigateTo && nextStep.navigateTo !== location.pathname) {
        console.log(`[NEXT] Navegando para ${nextStep.navigateTo} antes do próximo passo`)
        setIsNavigating(true)
        setRunTour(false)
        // Atualizar stepIndex antes de navegar
        setStepIndex(index + 1)
        navigate(nextStep.navigateTo)
        
        setTimeout(async () => {
          // Aguardar elemento aparecer
          if (nextStep.target && nextStep.target !== 'body') {
            await waitForElement(nextStep.target as string, 5000)
          }
          setIsNavigating(false)
          setTimeout(() => {
            console.log(`[NEXT] Retomando tour após navegação no passo ${index + 1}`)
            setRunTour(true)
          }, 400)
        }, 1000)
      }
      // Se não precisa navegar, deixar o Joyride avançar automaticamente com continuous=true
      // Não precisamos atualizar stepIndex manualmente
      return
    }

    // Quando o usuário clica em voltar
    if (action === 'prev') {
      console.log(`Voltando do passo ${index} para ${index - 1}`)
      const prevStep = completeTourSteps[index - 1]
      if (prevStep) {
        // Se precisa navegar para página anterior
        if (prevStep.navigateTo && prevStep.navigateTo !== location.pathname) {
          setIsNavigating(true)
          setRunTour(false)
          navigate(prevStep.navigateTo)
          setTimeout(() => {
            setIsNavigating(false)
            setStepIndex(index - 1)
            setTimeout(() => setRunTour(true), 300)
          }, 800)
        } else {
          setStepIndex(index - 1)
        }
      }
      return
    }

    // Quando o usuário clica em fechar (X ou botão Fechar)
    if (action === 'close') {
      // Se ainda há próximo passo, tratar como "next" (bug do Joyride com continuous=false)
      if (index < completeTourSteps.length - 1) {
        console.log(`[CLOSE->NEXT] Action 'close' detectado mas há próximo passo (${index + 1}), tratando como 'next'`)
        const nextStep = completeTourSteps[index + 1]
        
        if (nextStep.navigateTo && nextStep.navigateTo !== location.pathname) {
          setIsNavigating(true)
          setRunTour(false)
          setStepIndex(index + 1)
          navigate(nextStep.navigateTo)
          setTimeout(async () => {
            if (nextStep.target && nextStep.target !== 'body') {
              await waitForElement(nextStep.target as string, 5000)
            }
            setIsNavigating(false)
            setTimeout(() => setRunTour(true), 400)
          }, 1000)
        } else {
          setStepIndex(index + 1)
        }
        return
      }
      
      // Realmente fechar o tour
      console.log('Tour fechado pelo usuário (botão Fechar)')
      markTourAsCompleted()
      setRunTour(false)
      setStepIndex(0)
      setIsNavigating(false)
      setIsReady(false)
      if (onComplete) {
        onComplete()
      }
      return
    }

    // Quando o usuário clica em pular
    if (action === 'skip') {
      console.log('Tour pulado pelo usuário')
      markTourAsCompleted()
      setRunTour(false)
      setStepIndex(0)
      setIsNavigating(false)
      setIsReady(false)
      if (onComplete) {
        onComplete()
      }
      return
    }

    // Quando o tour termina ou é pulado
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      console.log('Tour finalizado')
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

  // Debug: log quando runTour muda (DEVE estar antes de qualquer return condicional)
  useEffect(() => {
    console.log('[EFFECT] runTour mudou para:', runTour, 'stepIndex:', stepIndex, 'isNavigating:', isNavigating, 'isReady:', isReady)
  }, [runTour, stepIndex, isNavigating, isReady])

  // Não mostrar o tour enquanto estiver navegando ou não estiver pronto
  if (isNavigating || !isReady) {
    return null
  }

  return (
    <Joyride
      steps={steps}
      run={runTour && !isNavigating && isReady}
      stepIndex={stepIndex}
      continuous={true}
      showProgress
      showSkipButton={true}
      callback={handleTourCallback}
      disableScrolling={false}
      disableOverlayClose={true}
      spotlightClicks={false}
      disableCloseOnEsc={true}
      hideCloseButton={true}
      floaterProps={{
        disableAnimation: true,
      }}
      spotlightPadding={5}
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
    />
  )
}

export function TourButton({ onStart }: { onStart: () => void }) {
  return (
    <button
      onClick={onStart}
      className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-maxpremier-blue-bright text-white rounded-lg hover:opacity-90 transition-opacity shadow-lg text-sm sm:text-base"
      title="Iniciar tour guiado"
    >
      <HelpCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
      <span className="hidden sm:inline">Tour Guiado</span>
      <span className="sm:hidden">Tour</span>
    </button>
  )
}

