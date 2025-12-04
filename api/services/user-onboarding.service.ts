import { HttpClient } from '../utils/http-client'
import type { UserOnboarding, Onboarding } from '../types'

export class UserOnboardingService {
  static async getUserOnboardings(userId: number): Promise<Array<Onboarding & { state: number }>> {
    return HttpClient.request<Array<Onboarding & { state: number }>>(
      `/userOnboardings/getAll?user_id=${userId}`
    )
  }

  static async assign(userId: number, onboardingId: number): Promise<UserOnboarding> {
    const normalizedUserId = Number(userId)
    const normalizedOnboardingId = Number(onboardingId)

    return HttpClient.request<UserOnboarding>('/userOnboardings/assign', {
      method: 'POST',
      body: JSON.stringify({
        user_id: normalizedUserId,
        onboarding_id: normalizedOnboardingId,
        state: 0,
      }),
    })
  }

  static async updateState(
    userId: number,
    onboardingId: number,
    state: number
  ): Promise<UserOnboarding> {
    return HttpClient.request<UserOnboarding>(
      `/userOnboardings/update/${userId}/${onboardingId}`,
      {
        method: 'PUT',
        body: JSON.stringify({ state }),
      }
    )
  }

  static async unassign(userId: number, onboardingId: number): Promise<void> {
    return HttpClient.request<void>(`/userOnboardings/unassign/${userId}/${onboardingId}`, {
      method: 'DELETE',
    })
  }
}