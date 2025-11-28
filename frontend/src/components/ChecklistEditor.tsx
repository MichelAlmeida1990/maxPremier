import { useState, useEffect } from 'react'
import { Plus, X, GripVertical, ChevronDown } from 'lucide-react'
import { ChecklistLocation } from '../services/checklists'

interface ChecklistEditorProps {
  locations: ChecklistLocation[]
  onChange: (locations: ChecklistLocation[]) => void
}

// Locais pré-definidos comuns
const PREDEFINED_LOCATIONS = [
  'Banheiro',
  'Salas de reunião',
  'Recepção',
  'Diretoria',
  'Área externa',
  'Corredor',
  'Batente',
  'Escada',
  'Cozinha',
  'Área de descanso',
  'Estacionamento',
  'Entrada principal',
  'Hall',
  'Sala de espera',
  'Escritórios',
  'Almoxarifado',
  'Depósito',
  'Garagem',
  'Área de serviço',
  'Jardim',
  'Fachada',
  'Portaria',
  'Elevador',
  'Escadaria',
  'Varanda',
  'Terraço',
]

export default function ChecklistEditor({ locations, onChange }: ChecklistEditorProps) {
  const [localLocations, setLocalLocations] = useState<ChecklistLocation[]>(locations)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [customLocation, setCustomLocation] = useState('')

  useEffect(() => {
    setLocalLocations(locations)
  }, [locations])

  const addLocation = (locationName: string) => {
    // Verifica se já existe
    if (localLocations.some((loc) => loc.name.toLowerCase() === locationName.toLowerCase())) {
      alert('Este local já foi adicionado')
      return
    }

    const newLocation: ChecklistLocation = {
      id: Date.now().toString(),
      name: locationName,
    }
    const updated = [...localLocations, newLocation]
    setLocalLocations(updated)
    onChange(updated)
    setIsDropdownOpen(false)
  }

  const addCustomLocation = () => {
    const trimmed = customLocation.trim()
    if (!trimmed) return

    if (localLocations.some((loc) => loc.name.toLowerCase() === trimmed.toLowerCase())) {
      alert('Este local já foi adicionado')
      setCustomLocation('')
      return
    }

    addLocation(trimmed)
    setCustomLocation('')
  }

  const removeLocation = (id: string) => {
    const updated = localLocations.filter((loc) => loc.id !== id)
    setLocalLocations(updated)
    onChange(updated)
  }

  const updateLocation = (id: string, name: string) => {
    const updated = localLocations.map((loc) => (loc.id === id ? { ...loc, name } : loc))
    setLocalLocations(updated)
    onChange(updated)
  }

  const moveLocation = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= localLocations.length) return

    const updated = [...localLocations]
    const [removed] = updated.splice(index, 1)
    updated.splice(newIndex, 0, removed)
    setLocalLocations(updated)
    onChange(updated)
  }

  const availableLocations = PREDEFINED_LOCATIONS.filter(
    (loc) => !localLocations.some((added) => added.name.toLowerCase() === loc.toLowerCase())
  )

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Locais de Inspeção <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-1 px-4 py-2 bg-maxpremier-blue-bright text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
          >
            <Plus size={16} />
            <span>Adicionar Local</span>
            <ChevronDown size={16} className={isDropdownOpen ? 'transform rotate-180' : ''} />
          </button>

          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto">
                <div className="p-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-2 px-2">
                    Locais Pré-definidos
                  </div>
                  {availableLocations.length > 0 ? (
                    <div className="space-y-1">
                      {availableLocations.map((location) => (
                        <button
                          key={location}
                          type="button"
                          onClick={() => addLocation(location)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded transition-colors"
                        >
                          {location}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 px-2 py-2">
                      Todos os locais pré-definidos foram adicionados
                    </p>
                  )}
                  
                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-2 px-2">
                      Adicionar Local Personalizado
                    </div>
                    <div className="flex space-x-1 px-2">
                      <input
                        type="text"
                        value={customLocation}
                        onChange={(e) => setCustomLocation(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addCustomLocation()
                          }
                        }}
                        placeholder="Digite um local..."
                        className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-maxpremier-blue-bright focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={addCustomLocation}
                        className="px-3 py-1.5 bg-maxpremier-yellow-green text-maxpremier-black rounded hover:opacity-90 transition-opacity text-sm font-medium"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {localLocations.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 mb-3">Nenhum local adicionado</p>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(true)}
            className="btn-secondary text-sm"
          >
            Adicionar Primeiro Local
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {localLocations.map((location, index) => (
            <div
              key={location.id}
              className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center space-x-2 flex-1">
                <GripVertical className="text-gray-400" size={20} />
                <span className="text-sm text-gray-500 w-8">{index + 1}.</span>
                <input
                  type="text"
                  value={location.name}
                  onChange={(e) => updateLocation(location.id, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maxpremier-blue-bright focus:border-transparent bg-white"
                />
              </div>
              <div className="flex items-center space-x-1">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveLocation(index, 'up')}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Mover para cima"
                  >
                    ↑
                  </button>
                )}
                {index < localLocations.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveLocation(index, 'down')}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Mover para baixo"
                  >
                    ↓
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeLocation(location.id)}
                  className="p-1 text-red-400 hover:text-red-600 transition-colors"
                  title="Remover"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {localLocations.length > 0 && (
        <p className="text-xs text-gray-500 mt-2">
          {localLocations.length} local(is) adicionado(s)
        </p>
      )}
    </div>
  )
}
