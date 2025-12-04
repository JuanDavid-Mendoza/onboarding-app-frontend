import { HttpClient } from '../utils/http-client'
import type { Onboarding } from '../types'

export class OnboardingService {
  static async getAll(): Promise<Onboarding[]> {
    return HttpClient.request<Onboarding[]>('/onboardings/getAll')
  }

  static async create(onboarding: Omit<Onboarding, 'id'>): Promise<Onboarding> {
    return HttpClient.request<Onboarding>('/onboardings/create', {
      method: 'POST',
      body: JSON.stringify(onboarding),
    })
  }

  static async update(id: number, onboarding: Partial<Onboarding>): Promise<Onboarding> {
    return HttpClient.request<Onboarding>(`/onboardings/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(onboarding),
    })
  }

  static async delete(id: number): Promise<void> {
    return HttpClient.request<void>(`/onboardings/delete/${id}`, {
      method: 'DELETE',
    })
  }
}