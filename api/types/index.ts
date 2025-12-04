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