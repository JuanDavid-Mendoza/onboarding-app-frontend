"use client"

import { useState, useEffect, useMemo } from "react"
import { LayoutWithSidebar } from "@/components/layout-with-sidebar"
import { useData } from "@/contexts/data-context"
import type { User, Onboarding } from "@/api/api-backend"
import { formatDate } from "@/lib/utils/date-helpers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FiPlus, FiEye, FiTrash2, FiSearch } from "react-icons/fi"
import { UserDetailModal } from "@/components/user-detail-modal"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
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

interface UserWithOnboardings extends User {
  userOnboardings: Array<Onboarding & { state: number }>
  status: { text: string; color: string }
  types: string
}

export default function DashboardPage() {
  const { users, deleteUser, getUserOnboardings } = useData()
  const { toast } = useToast()
  const [searchName, setSearchName] = useState("")
  const [searchEmail, setSearchEmail] = useState("")
  const [searchDate, setSearchDate] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterType, setFilterType] = useState<string>("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  // const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [usersWithOnboardings, setUsersWithOnboardings] = useState<UserWithOnboardings[]>([])
  const [loadingOnboardings, setLoadingOnboardings] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    const loadAllUsersOnboardings = async () => {
      setLoadingOnboardings(true)
      try {
        const usersData = await Promise.all(
          users
            .filter(user => user.role_id != 1)
            .map(async (user) => {
              try {
                const userOnboardings = await getUserOnboardings(user.id)
                const completedCount = userOnboardings.filter((o) => o.state == 1).length
                const totalCount = userOnboardings.length

                let status = { text: "Sin asignar", color: "text-muted-foreground" }
                if (totalCount > 0) {
                  if (completedCount === totalCount) {
                    status = { text: "Completado", color: "text-green-600" }
                  } else if (completedCount > 0) {
                    status = { text: `${completedCount}/${totalCount} completados`, color: "text-blue-600" }
                  } else {
                    status = { text: "Pendiente", color: "text-yellow-600" }
                  }
                }

                const types = [...new Set(userOnboardings.map((o) => o.onboarding_type))]
                const typesString = types.length > 0 ? types.join(", ") : "N/A"

                return {
                  ...user,
                  userOnboardings,
                  status,
                  types: typesString,
                }
              } catch (error) {
                return {
                  ...user,
                  userOnboardings: [],
                  status: { text: "Error", color: "text-red-600" },
                  types: "N/A",
                }
              }
            })
        )
        setUsersWithOnboardings(usersData)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoadingOnboardings(false)
      }
    }

    if (users.length > 0) {
      loadAllUsersOnboardings()
    }
  }, [users, getUserOnboardings])

  const filteredUsers = useMemo(() => {
    return usersWithOnboardings.filter((user) => {
      const matchesName = user.name.toLowerCase().includes(searchName.toLowerCase())
      const matchesEmail = user.email.toLowerCase().includes(searchEmail.toLowerCase())
      const matchesDate = searchDate ? formatDate(user.entry_date).includes(searchDate) : true

      const completedCount = user.userOnboardings.filter((o) => o.state == 1).length
      const totalCount = user.userOnboardings.length

      let matchesStatus = true
      if (filterStatus !== "all") {
        if (filterStatus === "completed") {
          matchesStatus = totalCount > 0 && completedCount === totalCount
        } else if (filterStatus === "in-progress") {
          matchesStatus = completedCount > 0 && completedCount < totalCount
        } else if (filterStatus === "pending") {
          matchesStatus = completedCount === 0 && totalCount > 0
        }else if (filterStatus === "unassigned") {
          matchesStatus = totalCount === 0
        }
      }

      let matchesType = true
      if (filterType !== "all") {
        matchesType = user.userOnboardings.some((o) => o.onboarding_type === filterType)
      }

      return matchesName && matchesEmail && matchesDate && matchesStatus && matchesType
    }).sort((a, b) => a.name.localeCompare(b.name))
  }, [usersWithOnboardings, searchName, searchEmail, searchDate, filterStatus, filterType])

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!userToDelete) return

    try {
      await deleteUser(userToDelete.id)
      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado exitosamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }

  const handleViewDetail = (user: User) => {
    setSelectedUser(user)
    setIsDetailModalOpen(true)
  }

  return (
    <LayoutWithSidebar>
      <Toaster />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Gestión de colaboradores y onboardings</p>
          </div>
          {/* <Button onClick={() => setIsCreateModalOpen(true)} style={{ backgroundColor: "#003DA5" }}>
            <FiPlus className="mr-2" />
            Crear Usuario
          </Button> */}
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
                <label className="text-sm font-medium">Correo</label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por correo"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha</label>
                <Input placeholder="dd/mm/yyyy" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Estado</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="completed">Completado</SelectItem>
                    <SelectItem value="in-progress">En progreso</SelectItem>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="unassigned">Sin asignar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
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

        <Card>
          <CardHeader>
            <CardTitle>Lista de Colaboradores</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingOnboardings ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Cargando información...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Correo</TableHead>
                      <TableHead>Fecha de Ingreso</TableHead>
                      <TableHead>Estado de Onboardings</TableHead>
                      <TableHead>Tipo de Onboarding</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          No se encontraron colaboradores
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{formatDate(user.entry_date)}</TableCell>
                          <TableCell>
                            <span className={user.status.color}>{user.status.text}</span>
                          </TableCell>
                          <TableCell className="text-sm max-w-xs whitespace-normal break-words">{user.types}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleViewDetail(user)}>
                                <FiEye className="mr-1" />
                                Ver
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(user)}>
                                <FiTrash2 />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedUser && (
        <UserDetailModal user={selectedUser} isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} />
      )}

      {/* <CreateUserModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} /> */}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el usuario <strong>{userToDelete?.name}</strong> y todos sus datos asociados.
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
