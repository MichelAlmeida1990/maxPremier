import { useState, useEffect } from 'react'
import { Visit, Client, ChecklistTemplate, User } from '../types'
import { visitsService } from '../services/visits'
import { clientsService } from '../services/clients'
import { checklistsService } from '../services/checklists'
import { usersService } from '../services/users'
import { CreateVisitData } from '../services/visits'
import Modal from '../components/Modal'
import VisitForm from '../components/VisitForm'
import { Search, Plus, Loader2, Calendar, Eye, Trash2, Filter, Download } from 'lucide-react'
import { generateVisitChecklistPDF } from '../utils/pdfGenerator'

export default function Visits() {
  const [visits, setVisits] = useState<Visit[]>([])
  const [filteredVisits, setFilteredVisits] = useState<Visit[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([])
  const [supervisors, setSupervisors] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null)
  const [visitToDelete, setVisitToDelete] = useState<Visit | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterMonth, setFilterMonth] = useState<number>(new Date().getMonth() + 1)
  const [filterYear, setFilterYear] = useState<number>(new Date().getFullYear())
  const [filterClientId, setFilterClientId] = useState<string>('')
  const [filterSetor, setFilterSetor] = useState<string>('')
  const [filterTurno, setFilterTurno] = useState<string>('')

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [visits, searchTerm, filterMonth, filterYear, filterClientId, filterSetor, filterTurno])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [visitsData, clientsData, templatesData, supervisorsData] = await Promise.all([
        visitsService.getAll(),
        clientsService.getAll(),
        checklistsService.getAll(),
        usersService.getAll(),
      ])
      setVisits(visitsData)
      setFilteredVisits(visitsData)
      setClients(clientsData)
      setTemplates(templatesData)
      setSupervisors(supervisorsData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      alert('Erro ao carregar dados. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...visits]

    // Filtro por mês e ano
    filtered = filtered.filter((visit) => {
      // Extrair apenas a parte da data para evitar problemas de timezone
      const dateOnly = typeof visit.date === 'string' ? visit.date.split('T')[0] : visit.date.toISOString().split('T')[0]
      const [year, month] = dateOnly.split('-').map(Number)
      return month === filterMonth && year === filterYear
    })

    // Filtro por cliente
    if (filterClientId) {
      filtered = filtered.filter((visit) => visit.clientId === filterClientId)
    }

    // Filtro por setor
    if (filterSetor) {
      filtered = filtered.filter((visit) => visit.setor === filterSetor)
    }

    // Filtro por turno
    if (filterTurno) {
      filtered = filtered.filter((visit) => visit.turno === filterTurno)
    }

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(
        (visit) =>
          visit.client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visit.supervisor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visit.nomeSupervisorManual?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visit.template?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visit.nomeColaborador?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visit.setor?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredVisits(filtered)
  }

  const handleCreate = () => {
    setIsModalOpen(true)
  }

  const handleView = (visit: Visit) => {
    setSelectedVisit(visit)
    setIsViewModalOpen(true)
  }

  const handleDelete = (visit: Visit) => {
    setVisitToDelete(visit)
    setIsDeleteModalOpen(true)
  }

  const handleSubmit = async (data: CreateVisitData) => {
    try {
      setIsSubmitting(true)
      await visitsService.create(data)
      setIsModalOpen(false)
      await loadData()
    } catch (error) {
      console.error('Erro ao criar visita:', error)
      alert('Erro ao criar visita. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (!visitToDelete) return

    try {
      setIsDeleting(true)
      await visitsService.delete(visitToDelete.id)
      setIsDeleteModalOpen(false)
      setVisitToDelete(null)
      await loadData()
    } catch (error) {
      console.error('Erro ao deletar visita:', error)
      alert('Erro ao deletar visita. Tente novamente.')
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    // Extrair apenas a parte da data (YYYY-MM-DD) para evitar problemas de timezone
    const dateOnly = dateString.split('T')[0]
    const [year, month, day] = dateOnly.split('-')
    return `${day}/${month}/${year}`
  }

  const getChecklistData = (visit: Visit): Record<string, string> => {
    try {
      return JSON.parse(visit.checklistData || '{}')
    } catch {
      return {}
    }
  }

  return (
    <div data-tour="visits-page">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-maxpremier-blue-dark">Visitas</h1>
        <button onClick={handleCreate} className="btn-primary flex items-center space-x-2 w-full sm:w-auto justify-center" data-tour="create-visit">
          <Plus size={20} />
          <span>Nova Visita</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="card mb-6" data-tour="visit-filters">
        <div className="flex items-center space-x-2 mb-4">
          <Filter size={20} className="text-gray-500" />
          <h3 className="font-semibold text-gray-700">Filtros</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mês</label>
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maxpremier-blue-bright"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
                  {new Date(2000, month - 1).toLocaleDateString('pt-BR', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
            <input
              type="number"
              value={filterYear}
              onChange={(e) => setFilterYear(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maxpremier-blue-bright"
              min="2020"
              max="2100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Setor</label>
            <select
              value={filterSetor}
              onChange={(e) => setFilterSetor(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maxpremier-blue-bright"
            >
              <option value="">Todos</option>
              <option value="Ronda">Ronda</option>
              <option value="Limpeza">Limpeza</option>
              <option value="Portaria">Portaria</option>
              <option value="Zeladoria">Zeladoria</option>
              <option value="Segurança Eletrônica">Segurança Eletrônica</option>
              <option value="Prevenção de Perdas">Prevenção de Perdas</option>
              <option value="Gestão de RH">Gestão de RH</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Turno</label>
            <select
              value={filterTurno}
              onChange={(e) => setFilterTurno(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maxpremier-blue-bright"
            >
              <option value="">Todos</option>
              <option value="Manhã">Manhã</option>
              <option value="Tarde">Tarde</option>
              <option value="Noite">Noite</option>
              <option value="Madrugada">Madrugada</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
            <select
              value={filterClientId}
              onChange={(e) => setFilterClientId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maxpremier-blue-bright"
            >
              <option value="">Todos</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Busca</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maxpremier-blue-bright"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Visitas */}
      <div className="card">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-maxpremier-blue-bright" size={32} />
            <span className="ml-3 text-gray-600">Carregando visitas...</span>
          </div>
        ) : filteredVisits.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 text-lg">
              {searchTerm || filterClientId || filterSetor || filterTurno ? 'Nenhuma visita encontrada.' : 'Nenhuma visita registrada ainda.'}
            </p>
            {!searchTerm && !filterClientId && !filterSetor && !filterTurno && (
              <button onClick={handleCreate} className="btn-primary mt-4">
                Registrar primeira visita
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-maxpremier-blue-dark">Data</th>
                  <th className="text-left py-3 px-4 font-semibold text-maxpremier-blue-dark">Cliente</th>
                  <th className="text-left py-3 px-4 font-semibold text-maxpremier-blue-dark">Setor</th>
                  <th className="text-left py-3 px-4 font-semibold text-maxpremier-blue-dark">Turno</th>
                  <th className="text-left py-3 px-4 font-semibold text-maxpremier-blue-dark">Colaborador</th>
                  <th className="text-left py-3 px-4 font-semibold text-maxpremier-blue-dark">Supervisor</th>
                  <th className="text-left py-3 px-4 font-semibold text-maxpremier-blue-dark">Status</th>
                  <th className="text-right py-3 px-4 font-semibold text-maxpremier-blue-dark">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisits.map((visit) => (
                  <tr key={visit.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">{formatDate(visit.date)}</td>
                    <td className="py-4 px-4 font-medium">{visit.client?.name || '-'}</td>
                    <td className="py-4 px-4">
                      {visit.setor ? (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                          {visit.setor}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-4 px-4">{visit.turno || '-'}</td>
                    <td className="py-4 px-4">{visit.nomeColaborador || '-'}</td>
                    <td className="py-4 px-4">{visit.nomeSupervisorManual || visit.supervisor?.name || '-'}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          visit.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : visit.status === 'signed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {visit.status === 'completed'
                          ? 'Concluída'
                          : visit.status === 'signed'
                          ? 'Assinada'
                          : 'Pendente'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleView(visit)}
                          className="p-2 text-maxpremier-blue-bright hover:bg-blue-50 rounded-lg transition-colors"
                          title="Visualizar"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              const checklistData = getChecklistData(visit)
                              const locations = visit.template?.locations 
                                ? JSON.parse(visit.template.locations)
                                : Object.keys(checklistData)
                              
                              const locationsWithValues = locations.map((loc: string) => ({
                                name: loc,
                                value: checklistData[loc] || ''
                              }))

                              const dateOnly = visit.date.split('T')[0]
                              const [year, month, day] = dateOnly.split('-')
                              const formattedDate = `${day}/${month}/${year}`

                              await generateVisitChecklistPDF({
                                clientName: visit.client?.name || 'N/A',
                                supervisorName: visit.nomeSupervisorManual || visit.supervisor?.name || 'N/A',
                                date: formattedDate,
                                checklistName: visit.template?.name || 'Checklist',
                                locations: locationsWithValues,
                                turno: visit.turno,
                                nomeColaborador: visit.nomeColaborador,
                                setor: visit.setor,
                              })
                            } catch (error) {
                              console.error('Erro ao gerar PDF:', error)
                              alert('Erro ao gerar PDF. Tente novamente.')
                            }
                          }}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Exportar PDF"
                        >
                          <Download size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(visit)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Deletar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Criar */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova Visita"
        size="lg"
        data-tour="visit-form-modal"
      >
        <VisitForm
          clients={clients}
          templates={templates}
          supervisors={supervisors}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Modal de Visualizar */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedVisit(null)
        }}
        title="Detalhes da Visita"
        size="lg"
      >
        {selectedVisit && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Cliente</label>
                <p className="text-gray-900">{selectedVisit.client?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Supervisor</label>
                <p className="text-gray-900">
                  {selectedVisit.nomeSupervisorManual || selectedVisit.supervisor?.name || '-'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Data</label>
                <p className="text-gray-900">{formatDate(selectedVisit.date)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Checklist</label>
                <p className="text-gray-900">{selectedVisit.template?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Setor</label>
                <p className="text-gray-900">
                  {selectedVisit.setor ? (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                      {selectedVisit.setor}
                    </span>
                  ) : (
                    '-'
                  )}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Turno</label>
                <p className="text-gray-900">{selectedVisit.turno || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Colaborador</label>
                <p className="text-gray-900 font-medium">{selectedVisit.nomeColaborador || '-'}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-lg mb-3">Preenchimento do Checklist</h3>
              <div className="space-y-3">
                {Object.entries(getChecklistData(selectedVisit)).map(([location, value]) => (
                  <div key={location}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{location}</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{value || '-'}</p>
                  </div>
                ))}
              </div>
            </div>

            {selectedVisit.notes && (
              <div className="border-t border-gray-200 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedVisit.notes}</p>
              </div>
            )}

            <div className="border-t border-gray-200 pt-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <label className="block text-sm font-medium text-gray-700">Status da Visita</label>
                <button
                  onClick={async () => {
                    try {
                      const checklistData = getChecklistData(selectedVisit)
                      const locations = selectedVisit.template?.locations 
                        ? JSON.parse(selectedVisit.template.locations)
                        : Object.keys(checklistData)
                      
                      const locationsWithValues = locations.map((loc: string) => ({
                        name: loc,
                        value: checklistData[loc] || ''
                      }))

                      const dateOnly = selectedVisit.date.split('T')[0]
                      const [year, month, day] = dateOnly.split('-')
                      const formattedDate = `${day}/${month}/${year}`

                      await generateVisitChecklistPDF({
                        clientName: selectedVisit.client?.name || 'N/A',
                        supervisorName: selectedVisit.nomeSupervisorManual || selectedVisit.supervisor?.name || 'N/A',
                        date: formattedDate,
                        checklistName: selectedVisit.template?.name || 'Checklist',
                        locations: locationsWithValues,
                        turno: selectedVisit.turno,
                        nomeColaborador: selectedVisit.nomeColaborador,
                        setor: selectedVisit.setor,
                      })
                    } catch (error) {
                      console.error('Erro ao gerar PDF:', error)
                      alert('Erro ao gerar PDF. Tente novamente.')
                    }
                  }}
                  className="btn-secondary flex items-center space-x-2 w-full sm:w-auto"
                >
                  <Download size={18} />
                  <span>Exportar Checklist em PDF</span>
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedVisit.status}
                  onChange={async (e) => {
                    try {
                      const newStatus = e.target.value
                      await visitsService.update(selectedVisit.id, { status: newStatus })
                      await loadData()
                      setSelectedVisit({ ...selectedVisit, status: newStatus })
                    } catch (error) {
                      console.error('Erro ao atualizar status:', error)
                      alert('Erro ao atualizar status. Tente novamente.')
                    }
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maxpremier-blue-bright focus:border-transparent"
                >
                  <option value="pending">Pendente</option>
                  <option value="completed">Concluída</option>
                  <option value="signed">Assinada</option>
                </select>
                <span
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    selectedVisit.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : selectedVisit.status === 'signed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {selectedVisit.status === 'completed'
                    ? 'Concluída'
                    : selectedVisit.status === 'signed'
                    ? 'Assinada'
                    : 'Pendente'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {selectedVisit.status === 'pending' && 'Visita criada, aguardando conclusão'}
                {selectedVisit.status === 'completed' && 'Visita concluída e checklist preenchido'}
                {selectedVisit.status === 'signed' && 'Visita assinada pelo cliente'}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de Confirmação de Delete */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setVisitToDelete(null)
        }}
        title="Confirmar Exclusão"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Tem certeza que deseja excluir esta visita?
          </p>
          <p className="text-sm text-gray-500">Esta ação não pode ser desfeita.</p>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false)
                setVisitToDelete(null)
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
