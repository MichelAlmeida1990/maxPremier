import api from './api'
import { ChecklistTemplate } from '../types'

export interface ChecklistLocation {
  id: string
  name: string
}

export const checklistsService = {
  async getAll(): Promise<ChecklistTemplate[]> {
    const response = await api.get<ChecklistTemplate[]>('/checklists')
    return response.data
  },

  async getById(id: string): Promise<ChecklistTemplate> {
    const response = await api.get<ChecklistTemplate>(`/checklists/${id}`)
    return response.data
  },

  async create(data: { name: string; description?: string; locations: ChecklistLocation[] }): Promise<ChecklistTemplate> {
    const response = await api.post<ChecklistTemplate>('/checklists', {
      ...data,
      locations: data.locations.map(loc => loc.name), // Envia apenas os nomes
    })
    return response.data
  },

  async update(
    id: string,
    data: { name: string; description?: string; locations: ChecklistLocation[] }
  ): Promise<ChecklistTemplate> {
    const response = await api.put<ChecklistTemplate>(`/checklists/${id}`, {
      ...data,
      locations: data.locations.map(loc => loc.name), // Envia apenas os nomes
    })
    return response.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/checklists/${id}`)
  },
}

