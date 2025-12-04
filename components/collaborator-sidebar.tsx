"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import { FiCalendar, FiFileText, FiLogOut, FiMenu, FiX, FiMoon, FiSun } from "react-icons/fi"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

const collaboratorMenuItems = [
  { name: "Mis Onboardings", icon: FiFileText, path: "/collaborator/onboardings" },
  { name: "Calendario", icon: FiCalendar, path: "/collaborator/calendar" },
]

export function CollaboratorSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border lg:hidden"
      >
        {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
      </button>

      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />}

      <aside
        className={cn(
          "fixed top-0 left-0 h-screen w-64 bg-card border-r border-border z-40 transition-transform duration-300 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <Image src="/logo_bb.png" alt="Banco de Bogotá" width={40} height={40} className="rounded" />
            <div>
              <h2 className="font-bold text-lg text-foreground">Onboarding</h2>
              <p className="text-xs text-muted-foreground">Portal Colaborador</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
              {user?.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {collaboratorMenuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => {
                  router.push(item.path)
                  setIsOpen(false)
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent",
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-accent transition-colors"
          >
            {theme === "dark" ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            <span className="font-medium">{theme === "dark" ? "Modo claro" : "Modo oscuro"}</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  )
}
