import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { Client, ChecklistTemplate, User } from '../types'
import { CreateVisitData } from '../services/visits'

interface VisitFormProps {
  clients: Client[]
  templates: ChecklistTemplate[]
  supervisors: User[]
  onSubmit: (data: CreateVisitData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

interface VisitFormData {
  clientId: string
  supervisorId: string
  supervisorManual?: string
  templateId: string
  date: string
  turno?: string
  nomeColaborador?: string
  setor?: string
  notes?: string
}

export default function VisitForm({
  clients,
  templates,
  supervisors,
  onSubmit,
  onCancel,
  isLoading,
}: VisitFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<VisitFormData>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
    },
  })

  const selectedTemplateId = watch('templateId')
  const supervisorId = watch('supervisorId')
  const [checklistData, setChecklistData] = useState<Record<string, string>>({})
  const [useManualSupervisor, setUseManualSupervisor] = useState(false)

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId)

  useEffect(() => {
    // Se selecionar "manual", mostrar campo de texto
    if (supervisorId === 'manual') {
      setUseManualSupervisor(true)
    } else {
      setUseManualSupervisor(false)
    }
  }, [supervisorId])

  useEffect(() => {
    if (selectedTemplate) {
      try {
        const locations = JSON.parse(selectedTemplate.locations || '[]')
        const initialData: Record<string, string> = {}
        locations.forEach((location: string) => {
          initialData[location] = ''
        })
        setChecklistData(initialData)
      } catch {
        setChecklistData({})
      }
    } else {
      setChecklistData({})
    }
  }, [selectedTemplate])

  const handleFormSubmit = async (data: VisitFormData) => {
    if (!selectedTemplate) {
      alert('Selecione um template de checklist')
      return
    }

    // Validar supervisor
    if (useManualSupervisor && !data.supervisorManual?.trim()) {
      alert('Preencha o nome do supervisor')
      return
    }

    if (!useManualSupervisor && !data.supervisorId) {
      alert('Selecione ou preencha o nome do supervisor')
      return
    }

    const hasEmptyFields = Object.values(checklistData).some((value) => !value.trim())
    if (hasEmptyFields) {
      alert('Preencha todos os campos do checklist')
      return
    }

    // Se usar supervisor manual, passar o nome no campo supervisorId como "manual:Nome"
    const finalSupervisorId = useManualSupervisor 
      ? `manual:${data.supervisorManual}` 
      : data.supervisorId

    await onSubmit({
      clientId: data.clientId,
      supervisorId: finalSupervisorId,
      templateId: data.templateId,
      date: data.date,
      checklistData,
      turno: data.turno,
      nomeColaborador: data.nomeColaborador,
      setor: data.setor,
      notes: data.notes,
    })
  }

  const getLocations = (): string[] => {
    if (!selectedTemplate) return []
    try {
      return JSON.parse(selectedTemplate.locations || '[]')
    } catch {
      return []
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-1">
            Cliente <span className="text-red-500">*</span>
          </label>
          <select
            id="clientId"
            {...register('clientId', { required: 'Cliente é obrigatório' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maxpremier-blue-bright focus:border-transparent"
          >
            <option value="">Selecione um cliente</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
          {errors.clientId && (
            <p className="mt-1 text-sm text-red-500">{errors.clientId.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="supervisorId" className="block text-sm font-medium text-gray-700 mb-1">
            Supervisor <span className="text-red-500">*</span>
          </label>
          <select
            id="supervisorId"
            {...register('supervisorId', { 
              required: !useManualSupervisor ? 'Supervisor é obrigatório' : false 
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maxpremier-blue-bright focus:border-transparent"
          >
            <option value="">Selecione um supervisor</option>
            {supervisors.map((supervisor) => (
              <option key={supervisor.id} value={supervisor.id}>
                {supervisor.name}
              </option>
            ))}
            <option value="manual">Outro (preencher manualmente)</option>
          </select>
          {errors.supervisorId && !useManualSupervisor && (
            <p className="mt-1 text-sm text-red-500">{errors.supervisorId.message}</p>
          )}
          
          {useManualSupervisor && (
            <div className="mt-2">
              <input
                type="text"
                id="supervisorManual"
                {...register('supervisorManual', { 
                  required: useManualSupervisor ? 'Nome do supervisor é obrigatório' : false 
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maxpremier-blue-bright focus:border-transparent"
                placeholder="Digite o nome do supervisor"
              />
              {errors.supervisorManual && (
                <p className="mt-1 text-sm text-red-500">{errors.supervisorManual.message}</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="templateId" className="block text-sm font-medium text-gray-700 mb-1">
            Template de Checklist <span className="text-red-500">*</span>
          </label>
          <select
            id="templateId"
            {...register('templateId', { required: 'Template é obrigatório' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maxpremier-blue-bright focus:border-transparent"
          >
            <option value="">Selecione um template</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
          {errors.templateId && (
            <p className="mt-1 text-sm text-red-500">{errors.templateId.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Data da Visita <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="date"
            {...register('date', { required: 'Data é obrigatória' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maxpremier-blue-bright focus:border-transparent"
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-500">{errors.date.message}</p>
          )}
        </div>
      </div>

      {/* Campos operacionais */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-semibold text-maxpremier-blue-dark mb-4">
          Informações Operacionais
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="setor" className="block text-sm font-medium text-gray-700 mb-1">
              Setor <span className="text-red-500">*</span>
            </label>
            <select
              id="setor"
              {...register('setor', { required: 'Setor é obrigatório' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maxpremier-blue-bright focus:border-transparent"
            >
              <option value="">Selecione o setor</option>
              <option value="Ronda">Ronda</option>
              <option value="Limpeza">Limpeza</option>
              <option value="Portaria">Portaria</option>
              <option value="Zeladoria">Zeladoria</option>
              <option value="Segurança Eletrônica">Segurança Eletrônica</option>
              <option value="Prevenção de Perdas">Prevenção de Perdas</option>
              <option value="Gestão de RH">Gestão de RH</option>
              <option value="Outro">Outro</option>
            </select>
            {errors.setor && (
              <p className="mt-1 text-sm text-red-500">{errors.setor.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="turno" className="block text-sm font-medium text-gray-700 mb-1">
              Turno <span className="text-red-500">*</span>
            </label>
            <select
              id="turno"
              {...register('turno', { required: 'Turno é obrigatório' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maxpremier-blue-bright focus:border-transparent"
            >
              <option value="">Selecione o turno</option>
              <option value="Manhã">Manhã (06h - 14h)</option>
              <option value="Tarde">Tarde (14h - 22h)</option>
              <option value="Noite">Noite (22h - 06h)</option>
              <option value="Madrugada">Madrugada (00h - 06h)</option>
            </select>
            {errors.turno && (
              <p className="mt-1 text-sm text-red-500">{errors.turno.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="nomeColaborador" className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Colaborador <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nomeColaborador"
              {...register('nomeColaborador', { required: 'Nome do colaborador é obrigatório' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maxpremier-blue-bright focus:border-transparent"
              placeholder="Nome completo do colaborador"
            />
            {errors.nomeColaborador && (
              <p className="mt-1 text-sm text-red-500">{errors.nomeColaborador.message}</p>
            )}
          </div>
        </div>
      </div>

      {selectedTemplate && getLocations().length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-semibold text-maxpremier-blue-dark mb-4">
            Preenchimento do Checklist
          </h3>
          <div className="space-y-3">
            {getLocations().map((location) => (
              <div key={location}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {location} <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={checklistData[location] || ''}
                  onChange={(e) =>
                    setChecklistData({ ...checklistData, [location]: e.target.value })
                  }
                  onKeyDown={(e) => {
                    // Permitir todos os atalhos de teclado (Ctrl+C, Ctrl+V, etc.)
                    e.stopPropagation()
                  }}
                  onClick={(e) => {
                    // Prevenir propagação de cliques
                    e.stopPropagation()
                  }}
                  onMouseDown={(e) => {
                    // Prevenir propagação de eventos de mouse
                    e.stopPropagation()
                  }}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maxpremier-blue-bright focus:border-transparent"
                  placeholder="Descreva o estado deste local..."
                  required
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Observações Gerais
        </label>
        <textarea
          id="notes"
          {...register('notes')}
          onKeyDown={(e) => {
            // Permitir todos os atalhos de teclado (Ctrl+C, Ctrl+V, etc.)
            e.stopPropagation()
          }}
          onClick={(e) => {
            e.stopPropagation()
          }}
          onMouseDown={(e) => {
            e.stopPropagation()
          }}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maxpremier-blue-bright focus:border-transparent"
          placeholder="Observações adicionais sobre a visita..."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Registrar Visita'}
        </button>
      </div>
    </form>
  )
}

