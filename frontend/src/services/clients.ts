import api from './api'
import { Client } from '../types'

export const clientsService = {
  async getAll(): Promise<Client[]> {
    const response = await api.get<Client[]>('/clients')
    return response.data
  },

  async getById(id: string): Promise<Client> {
    const response = await api.get<Client>(`/clients/${id}`)
    return response.data
  },

  async create(data: { name: string; contact?: string; address?: string }): Promise<Client> {
    const response = await api.post<Client>('/clients', data)
    return response.data
  },

  async update(id: string, data: { name: string; contact?: string; address?: string }): Promise<Client> {
    const response = await api.put<Client>(`/clients/${id}`, data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/clients/${id}`)
  },
}

