import { useForm } from 'react-hook-form'
import { Client } from '../types'

interface ClientFormData {
  name: string
  contact?: string
  address?: string
}

interface ClientFormProps {
  client?: Client
  onSubmit: (data: ClientFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export default function ClientForm({ client, onSubmit, onCancel, isLoading }: ClientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>({
    defaultValues: client
      ? {
          name: client.name,
          contact: client.contact || '',
          address: client.address || '',
        }
      : undefined,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nome do Cliente <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          {...register('name', { required: 'Nome é obrigatório' })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maxpremier-blue-bright focus:border-transparent"
          placeholder="Digite o nome do cliente"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
          Contato
        </label>
        <input
          type="text"
          id="contact"
          {...register('contact')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maxpremier-blue-bright focus:border-transparent"
          placeholder="Telefone ou email"
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Endereço
        </label>
        <textarea
          id="address"
          {...register('address')}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maxpremier-blue-bright focus:border-transparent"
          placeholder="Endereço completo"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
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
          {isLoading ? 'Salvando...' : client ? 'Atualizar' : 'Criar Cliente'}
        </button>
      </div>
    </form>
  )
}

