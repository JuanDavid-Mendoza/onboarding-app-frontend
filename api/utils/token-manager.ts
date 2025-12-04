import type { User } from '../types'

export class TokenManager {
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