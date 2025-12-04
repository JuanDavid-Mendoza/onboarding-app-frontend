"use client"

import { useState } from "react"
import { LayoutWithSidebar } from "@/components/layout-with-sidebar"
import { useData } from "@/contexts/data-context"
import { formatDate } from "@/lib/utils/date-helpers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi"
import { CreateOnboardingModal } from "@/components/create-onboarding-modal"
import { EditOnboardingModal } from "@/components/edit-onboarding-modal"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import type { Onboarding } from "@/api/api-backend"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function OnboardingsPage() {
  const { onboardings, deleteOnboarding } = useData()
  const { toast } = useToast()
  const [searchName, setSearchName] = useState("")
  const [searchStartDate, setSearchStartDate] = useState("")
  const [searchEndDate, setSearchEndDate] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedOnboarding, setSelectedOnboarding] = useState<Onboarding | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [onboardingToDelete, setOnboardingToDelete] = useState<Onboarding | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleDeleteClick = (onboarding: Onboarding) => {
    setOnboardingToDelete(onboarding)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!onboardingToDelete) return

    try {
      await deleteOnboarding(onboardingToDelete.id)
      toast({
        title: "Onboarding eliminado",
        description: "El onboarding ha sido eliminado exitosamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el onboarding",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setOnboardingToDelete(null)
    }
  }

  const handleEdit = (onboarding: Onboarding) => {
    setSelectedOnboarding(onboarding)
    setIsEditModalOpen(true)
  }

  const filteredOnboardings = onboardings.filter((onboarding) => {
    const matchesName = onboarding.name.toLowerCase().includes(searchName.toLowerCase())
    const matchesStartDate = searchStartDate ? formatDate(onboarding.start_date).includes(searchStartDate) : true
    const matchesEndDate = searchEndDate ? formatDate(onboarding.end_date).includes(searchEndDate) : true
    const matchesType = filterType === "all" || onboarding.onboarding_type === filterType

    return matchesName && matchesStartDate && matchesEndDate && matchesType
  }).sort((a, b) => {
    return new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  })

  return (
    <LayoutWithSidebar>
      <Toaster />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestión de Onboardings</h1>
            <p className="text-muted-foreground mt-1">Administra todos los programas de onboarding</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} style={{ backgroundColor: "#003DA5" }}>
            <FiPlus className="mr-2" />
            Crear Onboarding
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtros de Búsqueda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOnboardings.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">No se encontraron onboardings</div>
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
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(onboarding)}
                        className="w-8 h-8 p-0"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(onboarding)}
                        className="w-8 h-8 p-0"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-2">{onboarding.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{onboarding.description}</p>

                  <div className="space-y-2">
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

      <CreateOnboardingModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

      {selectedOnboarding && (
        <EditOnboardingModal
          onboarding={selectedOnboarding}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el onboarding <strong>{onboardingToDelete?.name}</strong> y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </LayoutWithSidebar>
  )
}
