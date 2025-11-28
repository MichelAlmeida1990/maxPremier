import api from './api'
import { User } from '../types'

export const usersService = {
  async getAll(): Promise<User[]> {
    const response = await api.get<User[]>('/users')
    return response.data
  },

  async getById(id: string): Promise<User> {
    const response = await api.get<User>(`/users/${id}`)
    return response.data
  },

  async create(data: { name: string; email: string; role?: string }): Promise<User> {
    const response = await api.post<User>('/users', data)
    return response.data
  },
}

