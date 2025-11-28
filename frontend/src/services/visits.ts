import api from './api'
import { Visit } from '../types'

export interface CreateVisitData {
  clientId: string
  supervisorId: string
  templateId?: string
  date: string
  checklistData: Record<string, any>
  turno?: string
  nomeColaborador?: string
  setor?: string
  notes?: string
}

export interface UpdateVisitData {
  checklistData?: Record<string, any>
  clientSignature?: string
  status?: string
  notes?: string
}

export const visitsService = {
  async getAll(params?: { month?: number; year?: number; clientId?: string }): Promise<Visit[]> {
    const queryParams = new URLSearchParams()
    if (params?.month) queryParams.append('month', params.month.toString())
    if (params?.year) queryParams.append('year', params.year.toString())
    if (params?.clientId) queryParams.append('clientId', params.clientId)

    const response = await api.get<Visit[]>(`/visits?${queryParams.toString()}`)
    return response.data
  },

  async getById(id: string): Promise<Visit> {
    const response = await api.get<Visit>(`/visits/${id}`)
    return response.data
  },

  async create(data: CreateVisitData): Promise<Visit> {
    const response = await api.post<Visit>('/visits', data)
    return response.data
  },

  async update(id: string, data: UpdateVisitData): Promise<Visit> {
    const response = await api.put<Visit>(`/visits/${id}`, data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/visits/${id}`)
  },
}

