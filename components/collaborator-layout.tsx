"use client"

import type React from "react"

import { CollaboratorSidebar } from "./collaborator-sidebar"

export function CollaboratorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CollaboratorSidebar />
      <main className="lg:ml-64 min-h-screen bg-background">
        <div className="p-6 lg:p-8 pt-20 lg:pt-8">{children}</div>
      </main>
    </>
  )
}
