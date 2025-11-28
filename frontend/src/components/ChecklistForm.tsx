import { useForm } from 'react-hook-form'
import { ChecklistTemplate } from '../types'
import { ChecklistLocation } from '../services/checklists'
import ChecklistEditor from './ChecklistEditor'
import { useState, useEffect } from 'react'

interface ChecklistFormData {
  name: string
  description?: string
}

interface ChecklistFormProps {
  template?: ChecklistTemplate
  onSubmit: (data: ChecklistFormData & { locations: ChecklistLocation[] }) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export default function ChecklistForm({ template, onSubmit, onCancel, isLoading }: ChecklistFormProps) {
  const [locations, setLocations] = useState<ChecklistLocation[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChecklistFormData>({
    defaultValues: template
      ? {
          name: template.name,
          description: template.description || '',
        }
      : undefined,
  })

  useEffect(() => {
    if (template) {
      try {
        const parsedLocations = JSON.parse(template.locations || '[]')
        const locationsWithIds: ChecklistLocation[] = parsedLocations.map((name: string, index: number) => ({
          id: `loc-${index}`,
          name,
        }))
        setLocations(locationsWithIds)
      } catch {
        setLocations([])
      }
    }
  }, [template])

  const handleFormSubmit = async (data: ChecklistFormData) => {
    const locationsWithNames = locations.filter((loc) => loc.name.trim() !== '')
    
    if (locationsWithNames.length === 0) {
      alert('Adicione pelo menos um local de inspeção')
      return
    }

    await onSubmit({
      ...data,
      locations: locationsWithNames,
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nome do Checklist <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          {...register('name', { required: 'Nome é obrigatório' })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maxpremier-blue-bright focus:border-transparent"
          placeholder="Ex: Checklist de Inspeção Semanal"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maxpremier-blue-bright focus:border-transparent"
          placeholder="Descreva o propósito deste checklist..."
        />
      </div>

      <ChecklistEditor locations={locations} onChange={setLocations} />

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Salvando...' : template ? 'Atualizar Checklist' : 'Criar Checklist'}
        </button>
      </div>
    </form>
  )
}

