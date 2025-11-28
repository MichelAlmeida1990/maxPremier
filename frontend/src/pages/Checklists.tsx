import { useState, useEffect } from 'react'
import { ChecklistTemplate } from '../types'
import { checklistsService } from '../services/checklists'
import { ChecklistLocation } from '../services/checklists'
import Modal from '../components/Modal'
import ChecklistForm from '../components/ChecklistForm'
import { Search, Edit, Trash2, Plus, Loader2, FileText, Download, Eye } from 'lucide-react'
import { generateChecklistPDF } from '../utils/pdfGenerator'

export default function Checklists() {
  const [checklists, setChecklists] = useState<ChecklistTemplate[]>([])
  const [filteredChecklists, setFilteredChecklists] = useState<ChecklistTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null)
  const [templateToDelete, setTemplateToDelete] = useState<ChecklistTemplate | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadChecklists()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = checklists.filter(
        (checklist) =>
          checklist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          checklist.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredChecklists(filtered)
    } else {
      setFilteredChecklists(checklists)
    }
  }, [searchTerm, checklists])

  const loadChecklists = async () => {
    try {
      setIsLoading(true)
      const data = await checklistsService.getAll()
      setChecklists(data)
      setFilteredChecklists(data)
    } catch (error) {
      console.error('Erro ao carregar checklists:', error)
      alert('Erro ao carregar checklists. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = () => {
    setSelectedTemplate(null)
    setIsModalOpen(true)
  }

  const handleView = (template: ChecklistTemplate) => {
    setSelectedTemplate(template)
    setIsViewModalOpen(true)
  }

  const handleEdit = (template: ChecklistTemplate) => {
    setSelectedTemplate(template)
    setIsModalOpen(true)
  }

  const handleDelete = (template: ChecklistTemplate) => {
    setTemplateToDelete(template)
    setIsDeleteModalOpen(true)
  }

  const handleSubmit = async (data: {
    name: string
    description?: string
    locations: ChecklistLocation[]
  }) => {
    try {
      setIsSubmitting(true)
      if (selectedTemplate) {
        await checklistsService.update(selectedTemplate.id, data)
      } else {
        await checklistsService.create(data)
      }
      setIsModalOpen(false)
      setSelectedTemplate(null)
      await loadChecklists()
    } catch (error) {
      console.error('Erro ao salvar checklist:', error)
      alert('Erro ao salvar checklist. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (!templateToDelete) return

    try {
      setIsDeleting(true)
      await checklistsService.delete(templateToDelete.id)
      setIsDeleteModalOpen(false)
      setTemplateToDelete(null)
      await loadChecklists()
    } catch (error) {
      console.error('Erro ao deletar checklist:', error)
      alert('Erro ao deletar checklist. Tente novamente.')
    } finally {
      setIsDeleting(false)
    }
  }

  const getLocationsCount = (template: ChecklistTemplate) => {
    try {
      const locations = JSON.parse(template.locations || '[]')
      return Array.isArray(locations) ? locations.length : 0
    } catch {
      return 0
    }
  }

  const getLocationsPreview = (template: ChecklistTemplate) => {
    try {
      const locations = JSON.parse(template.locations || '[]')
      if (Array.isArray(locations) && locations.length > 0) {
        return locations.slice(0, 3).join(', ') + (locations.length > 3 ? '...' : '')
      }
      return 'Nenhum local'
    } catch {
      return 'Nenhum local'
    }
  }

  const getLocationsArray = (template: ChecklistTemplate): string[] => {
    try {
      const locations = JSON.parse(template.locations || '[]')
      return Array.isArray(locations) ? locations : []
    } catch {
      return []
    }
  }

  const getLocationsList = (template: ChecklistTemplate): string[] => {
    return getLocationsArray(template)
  }

  const handleExportPDF = async (template: ChecklistTemplate) => {
    try {
      const locations = getLocationsArray(template)
      
      if (locations.length === 0) {
        alert('Este checklist não possui locais de inspeção. Adicione locais antes de exportar.')
        return
      }

      const today = new Date().toLocaleDateString('pt-BR')
      
      await generateChecklistPDF({
        checklistName: template.name,
        date: today,
        locations: locations,
        // Campos opcionais - podem ser preenchidos depois na visita
        turno: '',
        nomeColaborador: '',
        setor: '',
      })
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      alert('Erro ao gerar PDF. Tente novamente.')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-maxpremier-blue-dark">Checklists</h1>
        <button onClick={handleCreate} className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Novo Checklist</span>
        </button>
      </div>

      {/* Busca */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nome ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maxpremier-blue-bright focus:border-transparent"
          />
        </div>
      </div>

      {/* Lista de Checklists */}
      <div className="card">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-maxpremier-blue-bright" size={32} />
            <span className="ml-3 text-gray-600">Carregando checklists...</span>
          </div>
        ) : filteredChecklists.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'Nenhum checklist encontrado.' : 'Nenhum checklist criado ainda.'}
            </p>
            {!searchTerm && (
              <button onClick={handleCreate} className="btn-primary mt-4">
                Criar primeiro checklist
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredChecklists.map((checklist, index) => (
              <div
                key={checklist.id}
                className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white cursor-pointer"
                onClick={() => handleView(checklist)}
                data-tour={index === 0 ? "checklist-card" : undefined}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-maxpremier-blue-dark mb-1">
                      {checklist.name}
                    </h3>
                    {checklist.description && (
                      <p className="text-sm text-gray-600 mb-2">{checklist.description}</p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-500">Locais de inspeção:</span>
                    <span className="font-semibold text-maxpremier-blue-bright">
                      {getLocationsCount(checklist)} local(is)
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    {getLocationsPreview(checklist)}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleExportPDF(checklist)
                    }}
                    className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-maxpremier-yellow-green text-maxpremier-black rounded-lg hover:opacity-90 transition-opacity font-medium"
                    title="Exportar PDF"
                  >
                    <Download size={16} />
                    <span>Exportar PDF</span>
                  </button>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleView(checklist)
                      }}
                      className="p-2 text-maxpremier-blue-bright hover:bg-blue-50 rounded-lg transition-colors"
                      title="Visualizar"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(checklist)
                      }}
                      className="p-2 text-maxpremier-blue-bright hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(checklist)
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Deletar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Visualizar */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedTemplate(null)
        }}
        title={selectedTemplate?.name || 'Visualizar Checklist'}
        size="lg"
      >
        {selectedTemplate && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Checklist</label>
              <p className="text-lg font-semibold text-maxpremier-blue-dark">{selectedTemplate.name}</p>
            </div>

            {selectedTemplate.description && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedTemplate.description}</p>
              </div>
            )}

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Locais de Inspeção
                </label>
                <span className="text-sm font-semibold text-maxpremier-blue-bright">
                  {getLocationsCount(selectedTemplate)} local(is)
                </span>
              </div>
              <div className="space-y-2">
                {getLocationsList(selectedTemplate).map((location, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-maxpremier-blue-bright text-white rounded-full text-sm font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-gray-900 font-medium">{location}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsViewModalOpen(false)
                  setSelectedTemplate(null)
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  setIsViewModalOpen(false)
                  handleEdit(selectedTemplate)
                }}
                className="btn-secondary"
              >
                Editar Checklist
              </button>
              <button
                onClick={() => {
                  setIsViewModalOpen(false)
                  handleExportPDF(selectedTemplate)
                }}
                className="btn-primary flex items-center space-x-2"
              >
                <Download size={18} />
                <span>Exportar PDF</span>
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de Criar/Editar */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedTemplate(null)
        }}
        title={selectedTemplate ? 'Editar Checklist' : 'Novo Checklist'}
        size="lg"
      >
        <ChecklistForm
          template={selectedTemplate || undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false)
            setSelectedTemplate(null)
          }}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Modal de Confirmação de Delete */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setTemplateToDelete(null)
        }}
        title="Confirmar Exclusão"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Tem certeza que deseja excluir o checklist <strong>{templateToDelete?.name}</strong>?
          </p>
          <p className="text-sm text-gray-500">
            Esta ação não pode ser desfeita. Todas as visitas que usam este checklist serão afetadas.
          </p>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false)
                setTemplateToDelete(null)
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isDeleting}
            >
              Cancelar
            </button>
            <button
              onClick={confirmDelete}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              disabled={isDeleting}
            >
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
