"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FiCheckCircle, FiUsers, FiCalendar, FiBarChart } from "react-icons/fi"
import { useTheme } from "next-themes"
import { FiMoon, FiSun } from "react-icons/fi"

const features = [
  {
    icon: FiUsers,
    title: "Gestión de Colaboradores",
    description: "Administra y da seguimiento a todos los colaboradores en proceso de onboarding.",
  },
  {
    icon: FiCalendar,
    title: "Calendario Integrado",
    description: "Visualiza todos los eventos de onboarding en un calendario completo.",
  },
  {
    icon: FiBarChart,
    title: "Seguimiento en Tiempo Real",
    description: "Monitorea el progreso de cada colaborador y sus actividades asignadas.",
  },
  {
    icon: FiCheckCircle,
    title: "Control Total",
    description: "Gestiona múltiples onboardings y personaliza según las necesidades.",
  },
]

export default function LandingPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo_bb.png" alt="Banco de Bogotá" width={50} height={50} className="rounded" />
            <div>
              <h1 className="text-xl font-bold" style={{ color: "#003DA5" }}>
                Banco de Bogotá
              </h1>
              <p className="text-sm text-muted-foreground">Sistema de Onboarding</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              {theme === "dark" ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>
            <Button variant="outline" onClick={() => router.push("/login")}>
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-balance" style={{ color: "#003DA5" }}>
            Sistema de Gestión de Onboardings
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground mb-8 text-pretty">
            Optimiza el proceso de incorporación de nuevos colaboradores con nuestra plataforma integral. Gestiona,
            monitorea y mejora la experiencia de onboarding en tu organización.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => router.push("/register")}
              className="text-lg"
              style={{ backgroundColor: "#003DA5" }}
            >
              Comenzar Ahora
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push("/login")} className="text-lg">
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-muted/50 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-foreground">Funcionalidades Principales</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="border-border">
                  <CardContent className="p-6">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                      style={{ backgroundColor: "#003DA5" }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-lg mb-2 text-foreground">{feature.title}</h4>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 lg:py-24">
        <Card className="border-border" style={{ backgroundColor: "#F5F7FA" }}>
          <CardContent className="p-8 lg:p-12 text-center">
            <h3 className="text-3xl font-bold mb-4" style={{ color: "#003DA5" }}>
              ¿Listo para optimizar tu proceso de onboarding?
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Únete a nosotros y transforma la experiencia de incorporación de tus colaboradores.
            </p>
            <Button
              size="lg"
              onClick={() => router.push("/register")}
              className="text-lg"
              style={{ backgroundColor: "#003DA5" }}
            >
              Registrarse Ahora
            </Button>
          </CardContent>
        </Card>
      </section>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 Banco de Bogotá. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
