const API_BASE_URL = process.env.API_URL || 'http://localhost:3030'

export interface User {
  id: number
  name: string
  email: string
  entry_date: string
  password: string
  role_id: number
}

export interface Onboarding {
  id: number
  name: string
  description: string
  start_date: string
  end_date: string
  color: string
  onboarding_type?: string
  onboarding_type_id: string
}

export interface UserOnboarding {
  id: number
  user_id: number
  onboarding_id: number
  state: number
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  role_id: number
}

export interface RefreshRequest {
  refreshToken: string
}

class TokenManager {
  private static ACCESS_TOKEN_KEY = 'accessToken'
  private static REFRESH_TOKEN_KEY = 'refreshToken'
  private static USER_KEY = 'currentUser'

  static getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.ACCESS_TOKEN_KEY)
    }
    return null
  }

  static getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY)
    }
    return null
  }

  static getUser(): User | null {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem(this.USER_KEY)
      return user ? JSON.parse(user) : null
    }
    return null
  }

  static setTokens(accessToken: string, refreshToken: string, user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken)
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken)
      localStorage.setItem(this.USER_KEY, JSON.stringify(user))
    }
  }

  static clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY)
      localStorage.removeItem(this.REFRESH_TOKEN_KEY)
      localStorage.removeItem(this.USER_KEY)
    }
  }
}

export { TokenManager }

export class ApiService {
  private static isRefreshing = false
  private static refreshSubscribers: Array<(token: string) => void> = []

  private static subscribeTokenRefresh(callback: (token: string) => void) {
    this.refreshSubscribers.push(callback)
  }

  private static onTokenRefreshed(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token))
    this.refreshSubscribers = []
  }

  private static async refreshAccessToken(): Promise<string> {
    const refreshToken = TokenManager.getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      })

      if (!response.ok) {
        TokenManager.clearTokens()
        window.location.href = '/login'
        throw new Error('Failed to refresh token')
      }

      const data = await response.json()
      const newAccessToken = data.accessToken
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', newAccessToken)
      }

      return newAccessToken
    } catch (error) {
      TokenManager.clearTokens()
      window.location.href = '/login'
      throw error
    }
  }

  private static async request<T>(
    endpoint: string,
    options?: RequestInit,
    requiresAuth: boolean = true
  ): Promise<T> {
    const makeRequest = async (token?: string): Promise<Response> => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      if (options?.headers) {
        const customHeaders = new Headers(options.headers)
        customHeaders.forEach((value, key) => {
          headers[key] = value
        })
      }

      if (requiresAuth) {
        const accessToken = token || TokenManager.getAccessToken()
        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`
        }
      }

      return fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      })
    }

    let response = await makeRequest()

    if (response.status === 401 && requiresAuth && TokenManager.getRefreshToken()) {
      if (!this.isRefreshing) {
        this.isRefreshing = true
        try {
          const newToken = await this.refreshAccessToken()
          this.isRefreshing = false
          this.onTokenRefreshed(newToken)
          response = await makeRequest(newToken)
        } catch (error) {
          this.isRefreshing = false
          TokenManager.clearTokens()
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
          throw error
        }
      } else {
        try {
          const newToken = await new Promise<string>((resolve, reject) => {
            this.subscribeTokenRefresh(resolve)
            setTimeout(() => reject(new Error('Token refresh timeout')), 5000)
          })
          response = await makeRequest(newToken)
        } catch (error) {
          TokenManager.clearTokens()
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
          throw error
        }
      }
    }

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API Error: ${response.status} - ${errorText}`)
    }

    return response.json()
  }

  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }, false)
    
    TokenManager.setTokens(response.accessToken, response.refreshToken, response.user)
    return response
  }

  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }, false)
    
    TokenManager.setTokens(response.accessToken, response.refreshToken, response.user)
    return response
  }

  static async logout(): Promise<void> {
    TokenManager.clearTokens()
  }

  // Users
  static async getUsers() {
    return this.request<User[]>('/users/getAll')
  }

  static async createUser(user: Omit<User, 'id'>) {
    return this.request<User>('/users/create', {
      method: 'POST',
      body: JSON.stringify(user),
    })
  }

  static async updateUser(id: number, user: Partial<User>) {
    return this.request<User>(`/users/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    })
  }

  static async deleteUser(id: number) {
    return this.request<void>(`/users/delete/${id}`, {
      method: 'DELETE',
    })
  }

  // Onboardings
  static async getOnboardings() {
    return this.request<Onboarding[]>('/onboardings/getAll')
  }

  static async createOnboarding(onboarding: Omit<Onboarding, 'id'>) {
    return this.request<Onboarding>('/onboardings/create', {
      method: 'POST',
      body: JSON.stringify(onboarding),
    })
  }

  static async updateOnboarding(id: number, onboarding: Partial<Onboarding>) {
    return this.request<Onboarding>(`/onboardings/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(onboarding),
    })
  }

  static async deleteOnboarding(id: number) {
    return this.request<void>(`/onboardings/delete/${id}`, {
      method: 'DELETE',
    })
  }

  // UserOnboardings
  static async getUserOnboardings(userId: number) {
    return this.request<Array<Onboarding & { state: number }>>(
      `/userOnboardings/getAll?user_id=${userId}`
    )
  }

  static async assignOnboarding(userId: number, onboardingId: number) {
    userId = Number(userId)
    onboardingId = Number(onboardingId)

    return this.request<UserOnboarding>('/userOnboardings/assign', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, onboarding_id: onboardingId, state: 0 }),
    })
  }

  static async updateUserOnboarding(
    userId: number,
    onboardingId: number,
    state: number
  ) {
    return this.request<UserOnboarding>(
      `/userOnboardings/update/${userId}/${onboardingId}`,
      {
        method: 'PUT',
        body: JSON.stringify({ state }),
      }
    )
  }

  static async unassignOnboarding(userId: number, onboardingId: number) {
    return this.request<void>(`/userOnboardings/unassign/${userId}/${onboardingId}`, {
      method: 'DELETE',
    })
  }
}