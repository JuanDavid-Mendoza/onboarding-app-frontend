"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { CollaboratorLayout } from "@/components/collaborator-layout"
import { useAuth } from "@/contexts/auth-context"
import { useData } from "@/contexts/data-context"
import { formatDate } from "@/lib/utils/date-helpers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { FiSearch, FiCheck, FiX } from "react-icons/fi"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import type { Onboarding } from "@/api/api-backend"

function MisOnboardingsContent() {
  const { user } = useAuth()
  const { getUserOnboardings, updateUserOnboarding } = useData()
  const { toast } = useToast()
  const [searchName, setSearchName] = useState("")
  const [searchStartDate, setSearchStartDate] = useState("")
  const [searchEndDate, setSearchEndDate] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [myOnboardings, setMyOnboardings] = useState<Array<Onboarding & { state: number }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMyOnboardings = async () => {
      if (user) {
        try {
          setLoading(true)
          const onboardings = await getUserOnboardings(user.id)
          setMyOnboardings(onboardings)
        } catch (error) {
          console.error("Error loading onboardings:", error)
          toast({
            title: "Error",
            description: "No se pudieron cargar tus onboardings",
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      }
    }

    loadMyOnboardings()
  }, [user, getUserOnboardings, toast])

  const handleToggleState = async (onboardingId: number, currentState: number) => {
    if (!user) return

    try {
      const newState = currentState == 1 ? 0 : 1
      await updateUserOnboarding(user.id, onboardingId, newState)

      const updatedOnboardings = await getUserOnboardings(user.id)
      setMyOnboardings(updatedOnboardings)

      toast({
        title: "Estado actualizado",
        description: `Onboarding marcado como ${newState == 1 ? "completado" : "pendiente"}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive",
      })
    }
  }

  const filteredOnboardings = myOnboardings.filter((onboarding) => {
    const matchesName = onboarding.name.toLowerCase().includes(searchName.toLowerCase())
    const matchesStartDate = searchStartDate ? formatDate(onboarding.start_date).includes(searchStartDate) : true
    const matchesEndDate = searchEndDate ? formatDate(onboarding.end_date).includes(searchEndDate) : true
    const matchesType = filterType === "all" || onboarding.onboarding_type === filterType
    
    let matchesStatus = true
    if (filterStatus !== "all") {
      if (filterStatus === "completed") {
        matchesStatus = onboarding.state == 1
      } else if (filterStatus === "pending") {
        matchesStatus = onboarding.state == 0
      }
    }

    return matchesName && matchesStartDate && matchesEndDate && matchesType && matchesStatus
  }).sort((a, b) => {
    if (a.state !== b.state) {
      return a.state - b.state
    }
    return new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  })

  return (
    <CollaboratorLayout>
      <Toaster />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mis Onboardings</h1>
          <p className="text-muted-foreground mt-1">Programas de onboarding asignados a ti</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtros de Búsqueda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre</label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha Inicio</label>
                <Input
                  placeholder="dd/mm/yyyy"
                  value={searchStartDate}
                  onChange={(e) => setSearchStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha Fin</label>
                <Input
                  placeholder="dd/mm/yyyy"
                  value={searchEndDate}
                  onChange={(e) => setSearchEndDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="h-auto min-h-[40px]">
                    <SelectValue>
                      <span className="block whitespace-normal break-words leading-tight py-1">
                        {filterType === "all" && "Todos"}
                        {filterType === "Onboarding de Bienvenida General" && "Onboarding de Bienvenida General"}
                        {filterType === "Onboarding Técnico" && "Onboarding Técnico"}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Onboarding de Bienvenida General">Onboarding de Bienvenida General</SelectItem>
                    <SelectItem value="Onboarding Técnico">Onboarding Técnico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Estado</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="completed">Completado</SelectItem>
                    <SelectItem value="pending">Pendiente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">Cargando onboardings...</div>
          ) : filteredOnboardings.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">No tienes onboardings asignados</div>
          ) : (
            filteredOnboardings.map((onboarding) => (
              <Card key={onboarding.id} className="border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                      style={{ backgroundColor: onboarding.color }}
                    >
                      {onboarding.name.charAt(0)}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant={onboarding.state == 1 ? "default" : "outline"}
                        onClick={() => handleToggleState(onboarding.id, onboarding.state)}
                        className="w-8 h-8 p-0"
                        title={onboarding.state == 1 ? "Marcar como pendiente" : "Marcar como completado"}
                      >
                        <FiCheck className={onboarding.state == 1 ? "text-white" : "text-green-600"} />
                      </Button>
                      <Button
                        size="sm"
                        variant={onboarding.state == 0 ? "destructive" : "outline"}
                        onClick={() => handleToggleState(onboarding.id, onboarding.state)}
                        className="w-8 h-8 p-0"
                        title={onboarding.state == 0 ? "Marcar como completado" : "Marcar como pendiente"}
                      >
                        <FiX />
                      </Button>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-2">{onboarding.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{onboarding.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Estado:</span>
                      <span className={`font-medium ${onboarding.state == 1 ? "text-green-600" : "text-yellow-600"}`}>
                        {onboarding.state == 1 ? "Completado" : "Pendiente"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tipo:</span>
                      <span className="font-medium text-foreground">{onboarding.onboarding_type}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Inicio:</span>
                      <span className="font-medium text-foreground">{formatDate(onboarding.start_date)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Fin:</span>
                      <span className="font-medium text-foreground">{formatDate(onboarding.end_date)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Color:</span>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded border border-border"
                          style={{ backgroundColor: onboarding.color }}
                        />
                        <span className="font-mono text-xs">{onboarding.color}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </CollaboratorLayout>
  )
}

export default function MisOnboardingsPage() {
  return (
    <ProtectedRoute>
      <MisOnboardingsContent />
    </ProtectedRoute>
  )
}
