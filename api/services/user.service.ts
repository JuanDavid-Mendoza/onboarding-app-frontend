import { HttpClient } from '../utils/http-client'
import type { User } from '../types'

export class UserService {
  static async getAll(): Promise<User[]> {
    return HttpClient.request<User[]>('/users/getAll')
  }

  static async create(user: Omit<User, 'id'>): Promise<User> {
    return HttpClient.request<User>('/users/create', {
      method: 'POST',
      body: JSON.stringify(user),
    })
  }

  static async update(id: number, user: Partial<User>): Promise<User> {
    return HttpClient.request<User>(`/users/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    })
  }

  static async delete(id: number): Promise<void> {
    return HttpClient.request<void>(`/users/delete/${id}`, {
      method: 'DELETE',
    })
  }
}