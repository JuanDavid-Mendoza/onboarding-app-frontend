import { HttpClient } from '../utils/http-client'
import { TokenManager } from '../utils/token-manager'
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types'

export class AuthService {
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await HttpClient.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }, false)

    TokenManager.setTokens(response.accessToken, response.refreshToken, response.user)
    return response
  }

  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await HttpClient.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }, false)

    TokenManager.setTokens(response.accessToken, response.refreshToken, response.user)
    return response
  }

  static async logout(): Promise<void> {
    TokenManager.clearTokens()
  }
}