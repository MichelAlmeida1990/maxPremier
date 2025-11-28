import { useState, useEffect } from 'react'
import { visitsService } from '../services/visits'
import { clientsService } from '../services/clients'
import { checklistsService } from '../services/checklists'
import { Visit } from '../types'
import { Loader2, Calendar, Users, ClipboardList, TrendingUp, RefreshCw } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalVisits: 0,
    totalClients: 0,
    totalChecklists: 0,
    visitsThisMonth: 0,
  })
  const [monthlyData, setMonthlyData] = useState<Array<{ month: string; visits: number }>>([])
  const [sectorData, setSectorData] = useState<Array<{ setor: string; visits: number }>>([])
  const [turnoData, setTurnoData] = useState<Array<{ turno: string; visits: number }>>([])
  const [recentVisits, setRecentVisits] = useState<Visit[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      const now = new Date()
      const currentMonth = now.getMonth() + 1
      const currentYear = now.getFullYear()

      const [visits, clients, checklists, visitsThisMonth] = await Promise.all([
        visitsService.getAll(),
        clientsService.getAll(),
        checklistsService.getAll(),
        visitsService.getAll({ month: currentMonth, year: currentYear }),
      ])

      // Calcular estatísticas
      setStats({
        totalVisits: visits.length,
        totalClients: clients.length,
        totalChecklists: checklists.length,
        visitsThisMonth: visitsThisMonth.length,
      })

      // Preparar dados mensais (últimos 6 meses)
      const monthlyVisits: Record<string, number> = {}
      const monthNames = [
        'Jan',
        'Fev',
        'Mar',
        'Abr',
        'Mai',
        'Jun',
        'Jul',
        'Ago',
        'Set',
        'Out',
        'Nov',
        'Dez',
      ]

      // Criar chaves para os últimos 6 meses (incluindo o mês atual)
      // Exemplo: Se estamos em Nov/2024, mostra: Jun/2024, Jul/2024, Ago/2024, Set/2024, Out/2024, Nov/2024
      for (let i = 5; i >= 0; i--) {
        // Calcular o mês: currentMonth - 1 - i
        // Se currentMonth = 11 (novembro), currentMonth - 1 = 10
        // i=5: 10-5=5 (junho), i=4: 10-4=6 (julho), ..., i=0: 10-0=10 (novembro)
        let targetMonth = currentMonth - 1 - i
        let targetYear = currentYear

        // Ajustar se o mês for negativo (ano anterior)
        while (targetMonth < 0) {
          targetMonth += 12
          targetYear--
        }

        const date = new Date(targetYear, targetMonth, 1)
        const monthKey = `${monthNames[date.getMonth()]}/${date.getFullYear()}`
        monthlyVisits[monthKey] = 0
      }

      // Processar visitas e contar por mês
      visits.forEach((visit) => {
        // Parse correto da data (pode vir como string ISO ou Date)
        let visitDate: Date
        if (typeof visit.date === 'string') {
          visitDate = new Date(visit.date)
        } else {
          visitDate = new Date(visit.date)
        }

        // Verificar se a data é válida
        if (isNaN(visitDate.getTime())) {
          console.warn('Data inválida na visita:', visit.id, visit.date)
          return
        }

        const visitMonth = visitDate.getMonth()
        const visitYear = visitDate.getFullYear()
        const monthKey = `${monthNames[visitMonth]}/${visitYear}`

        // Incrementar se o mês estiver nos últimos 6 meses
        if (monthlyVisits[monthKey] !== undefined) {
          monthlyVisits[monthKey]++
        }
      })

      setMonthlyData(
        Object.entries(monthlyVisits).map(([month, visits]) => ({
          month,
          visits,
        }))
      )

      // Estatísticas por setor
      const sectorStats: Record<string, number> = {}
      visits.forEach((visit) => {
        const setor = visit.setor || 'Não informado'
        sectorStats[setor] = (sectorStats[setor] || 0) + 1
      })
      setSectorData(
        Object.entries(sectorStats)
          .map(([setor, visits]) => ({ setor, visits }))
          .sort((a, b) => b.visits - a.visits)
      )

      // Estatísticas por turno
      const turnoStats: Record<string, number> = {}
      visits.forEach((visit) => {
        const turno = visit.turno || 'Não informado'
        turnoStats[turno] = (turnoStats[turno] || 0) + 1
      })
      setTurnoData(
        Object.entries(turnoStats)
          .map(([turno, visits]) => ({ turno, visits }))
          .sort((a, b) => b.visits - a.visits)
      )

      // Visitas recentes (últimas 5)
      const sortedVisits = [...visits]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
      setRecentVisits(sortedVisits)
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-maxpremier-blue-bright" size={32} />
        <span className="ml-3 text-gray-600">Carregando dashboard...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-maxpremier-blue-dark">Dashboard</h1>
        <button
          onClick={loadDashboardData}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-maxpremier-blue-bright text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          <span>Atualizar</span>
        </button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Visitas do Mês</h3>
              <p className="text-3xl font-bold text-maxpremier-blue-bright">{stats.visitsThisMonth}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="text-maxpremier-blue-bright" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total de Visitas</h3>
              <p className="text-3xl font-bold text-maxpremier-blue-bright">{stats.totalVisits}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Checklists Ativos</h3>
              <p className="text-3xl font-bold text-maxpremier-blue-bright">{stats.totalChecklists}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <ClipboardList className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Clientes</h3>
              <p className="text-3xl font-bold text-maxpremier-blue-bright">{stats.totalClients}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Users className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Visitas Mensais */}
        {monthlyData.length > 0 && (
          <div className="card">
            <h2 className="text-xl font-semibold text-maxpremier-blue-dark mb-4">
              Visitas por Mês (Últimos 6 meses)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="visits" fill="#00afee" name="Visitas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Gráfico por Setor */}
        {sectorData.length > 0 && (
          <div className="card">
            <h2 className="text-xl font-semibold text-maxpremier-blue-dark mb-4">
              Visitas por Setor
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sectorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="setor" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="visits" fill="#ccff00" name="Visitas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Estatísticas por Turno */}
      {turnoData.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-maxpremier-blue-dark mb-4">
            Visitas por Turno
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {turnoData.map((item) => (
              <div key={item.turno} className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">{item.turno}</p>
                <p className="text-2xl font-bold text-maxpremier-blue-bright">{item.visits}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visitas Recentes */}
      {recentVisits.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-maxpremier-blue-dark mb-4">Visitas Recentes</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Data</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Cliente</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Setor</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Turno</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Colaborador</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Supervisor</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentVisits.map((visit) => (
                  <tr key={visit.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{formatDate(visit.date)}</td>
                    <td className="py-3 px-4 font-medium">{visit.client?.name || '-'}</td>
                    <td className="py-3 px-4">
                      {visit.setor ? (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                          {visit.setor}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-3 px-4">{visit.turno || '-'}</td>
                    <td className="py-3 px-4">{visit.nomeColaborador || '-'}</td>
                    <td className="py-3 px-4">{visit.nomeSupervisorManual || visit.supervisor?.name || '-'}</td>
                    <td className="py-3 px-4">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {stats.totalVisits === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Nenhuma visita registrada ainda.</p>
          <p className="text-gray-400">Comece criando clientes e checklists para registrar visitas.</p>
        </div>
      )}
    </div>
  )
}
