"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { ApiService, TokenManager } from "@/api/api-backend"
import type { User, Onboarding, UserOnboarding } from "@/api/api-backend"

interface DataContextType {
  users: User[]
  onboardings: Onboarding[]
  userOnboardings: UserOnboarding[]
  loading: boolean
  error: string | null
  addUser: (user: Omit<User, "id">) => Promise<void>
  updateUser: (id: number, user: Partial<User>) => Promise<User>
  deleteUser: (id: number) => Promise<void>
  addOnboarding: (onboarding: Omit<Onboarding, "id">) => Promise<void>
  updateOnboarding: (id: number, onboarding: Partial<Onboarding>) => Promise<void>
  deleteOnboarding: (id: number) => Promise<void>
  updateUserOnboarding: (userId: number, onboardingId: number, state: number) => Promise<void>
  assignOnboarding: (userId: number, onboardingId: number) => Promise<void>
  unassignOnboarding: (userId: number, onboardingId: number) => Promise<void>
  getUserOnboardings: (userId: number) => Promise<Array<Onboarding & { state: number }>>
  refreshData: () => Promise<void>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([])
  const [onboardings, setOnboardings] = useState<Onboarding[]>([])
  const [userOnboardings, setUserOnboardings] = useState<UserOnboarding[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [usersData, onboardingsData] = await Promise.all([
        ApiService.getUsers(),
        ApiService.getOnboardings(),
      ])
      setUsers(usersData)
      setOnboardings(onboardingsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading data')
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const accessToken = TokenManager.getAccessToken()
    if (accessToken) {
      refreshData()
    } else {
      setLoading(false)
    }
  }, [])

  const addUser = async (user: Omit<User, "id">) => {
    try {
      const newUser = await ApiService.createUser(user)
      setUsers([...users, newUser])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating user')
      throw err
    }
  }

  const updateUser = async (id: number, updatedUser: Partial<User>) => {
    try {
      const updated = await ApiService.updateUser(id, updatedUser)
      setUsers(users.map((u) => (u.id === id ? updated : u)))
      return updated
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating user')
      throw err
    }
  }

  const deleteUser = async (id: number) => {
    try {
      await ApiService.deleteUser(id)
      setUsers(users.filter((u) => u.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting user')
      throw err
    }
  }

  const addOnboarding = async (onboarding: Omit<Onboarding, "id">) => {
    try {
      const newOnboarding = await ApiService.createOnboarding(onboarding)
      newOnboarding.onboarding_type = Number(onboarding.onboarding_type_id) === 1 ? 'Onboarding de Bienvenida General' : 'Onboarding Técnico';
      setOnboardings([...onboardings, newOnboarding])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating onboarding')
      throw err
    }
  }

  const updateOnboarding = async (id: number, updatedOnboarding: Partial<Onboarding>) => {
    try {
      const updated = await ApiService.updateOnboarding(id, updatedOnboarding)
      setOnboardings(onboardings.map((o) => (o.id === id ? updated : o)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating onboarding')
      throw err
    }
  }

  const deleteOnboarding = async (id: number) => {
    try {
      await ApiService.deleteOnboarding(id)
      setOnboardings(onboardings.filter((o) => o.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting onboarding')
      throw err
    }
  }

  const updateUserOnboarding = async (userId: number, onboardingId: number, state: number) => {
    try {
      await ApiService.updateUserOnboarding(userId, onboardingId, state)
      await refreshData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating user onboarding')
      throw err
    }
  }

  const assignOnboarding = async (userId: number, onboardingId: number) => {
    try {
      await ApiService.assignOnboarding(userId, onboardingId)
      await refreshData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error assigning onboarding')
      throw err
    }
  }

  const unassignOnboarding = async (userId: number, onboardingId: number) => {
    try {
      await ApiService.unassignOnboarding(userId, onboardingId)
      await refreshData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error unassigning onboarding')
      throw err
    }
  }

  const getUserOnboardings = async (userId: number): Promise<Array<Onboarding & { state: number }>> => {
    try {
      return await ApiService.getUserOnboardings(userId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching user onboardings')
      throw err
    }
  }

  return (
    <DataContext.Provider
      value={{
        users,
        onboardings,
        userOnboardings,
        loading,
        error,
        addUser,
        updateUser,
        deleteUser,
        addOnboarding,
        updateOnboarding,
        deleteOnboarding,
        updateUserOnboarding,
        assignOnboarding,
        unassignOnboarding,
        getUserOnboardings,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}