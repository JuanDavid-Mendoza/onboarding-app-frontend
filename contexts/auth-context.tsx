"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { ApiService, TokenManager, type User } from "@/api/api-backend"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string, role_id: number) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = TokenManager.getUser()
    const accessToken = TokenManager.getAccessToken()
    
    if (storedUser && accessToken) {
      setUser(storedUser)
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await ApiService.login({ email, password })
      
      setUser(response.user)
      setIsAuthenticated(true)
      
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const register = async (name: string, email: string, password: string, role_id: number): Promise<boolean> => {
    try {
      const response = await ApiService.register({ name, email, password, role_id })
      
      setUser(response.user)
      setIsAuthenticated(true)
      
      return true
    } catch (error) {
      console.error('Register error:', error)
      return false
    }
  }

  const logout = () => {
    ApiService.logout()
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
