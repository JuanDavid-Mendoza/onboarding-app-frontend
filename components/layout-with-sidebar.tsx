"use client"

import type React from "react"

import { ProtectedRoute } from "./protected-route"
import { Sidebar } from "./sidebar"

export function LayoutWithSidebar({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-4 lg:p-8">{children}</main>
      </div>
    </ProtectedRoute>
  )
}
