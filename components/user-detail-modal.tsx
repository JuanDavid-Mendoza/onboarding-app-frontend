"use client"

import { useState, useEffect } from "react"
import type { User, Onboarding } from "@/api/api-backend"
import { useData } from "@/contexts/data-context"
import { formatDate } from "@/lib/utils/date-helpers"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FiCheck, FiX, FiEdit2, FiSave } from "react-icons/fi"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

interface UserDetailModalProps {
  user: User
  isOpen: boolean
  onClose: () => void
}

export function UserDetailModal({ user, isOpen, onClose }: UserDetailModalProps) {
  const { updateUser, getUserOnboardings, onboardings, updateUserOnboarding, assignOnboarding, unassignOnboarding } =
    useData()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState(user)
  const [selectedOnboardings, setSelectedOnboardings] = useState<number[]>([])
  const [userOnboardings, setUserOnboardings] = useState<Array<Onboarding & { state: number }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setEditedUser(user)
  }, [user])

  useEffect(() => {
    const loadUserOnboardings = async () => {
      try {
        setLoading(true)
        const onboardingsData = await getUserOnboardings(user.id)
        setUserOnboardings(onboardingsData)
        setSelectedOnboardings(onboardingsData.map((o) => o.id))
      } catch (error) {
        console.error("Error loading user onboardings:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los onboardings del usuario",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      loadUserOnboardings()
    }
  }, [user.id, isOpen, getUserOnboardings, toast])

  const handleSave = async () => {
    try {
      const updatedUserData = await updateUser(user.id, {
        name: editedUser.name,
        email: editedUser.email,
        entry_date: editedUser.entry_date,
      })

      setEditedUser(updatedUserData)

      const currentAssignments = userOnboardings.map((o) => o.id)
      const toAssign = selectedOnboardings.filter((id) => !currentAssignments.includes(id))
      const toUnassign = currentAssignments.filter((id) => !selectedOnboardings.includes(id))

      await Promise.all([
        ...toAssign.map((id) => assignOnboarding(user.id, id)),
        ...toUnassign.map((id) => unassignOnboarding(user.id, id)),
      ])

      const updatedOnboardings = await getUserOnboardings(user.id)
      setUserOnboardings(updatedOnboardings)

      setIsEditing(false)
      toast({
        title: "Cambios guardados",
        description: "La información del usuario ha sido actualizada",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios",
        variant: "destructive",
      })
    }
  }

  const handleToggleOnboardingState = async (onboardingId: number, currentState: number) => {
    try {
      const newState = currentState == 1 ? 0 : 1
      await updateUserOnboarding(user.id, onboardingId, newState)

      const updatedOnboardings = await getUserOnboardings(user.id)
      setUserOnboardings(updatedOnboardings)

      toast({
        title: "Estado actualizado",
        description: `Onboarding marcado como ${newState ? "completado" : "pendiente"}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Detalle del Colaborador</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Información Personal</CardTitle>
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <FiEdit2 className="mr-2" />
                  Editar
                </Button>
              ) : (
                <Button size="sm" onClick={handleSave} style={{ backgroundColor: "#003DA5" }}>
                  <FiSave className="mr-2" />
                  Guardar
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  {isEditing ? (
                    <Input
                      value={editedUser.name}
                      onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                    />
                  ) : (
                    <p className="text-foreground font-medium">{editedUser.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Correo</Label>
                  {isEditing ? (
                    <Input
                      value={editedUser.email}
                      onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                    />
                  ) : (
                    <p className="text-foreground font-medium">{editedUser.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Fecha de Ingreso</Label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={editedUser.entry_date ? editedUser.entry_date.split('T')[0] : ''}
                      onChange={(e) => setEditedUser({ ...editedUser, entry_date: new Date(e.target.value).toISOString() })}
                    />
                  ) : (
                    <p className="text-foreground font-medium">{formatDate(editedUser.entry_date)}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Onboardings Completados</Label>
                  <p className="text-foreground font-medium">
                    {userOnboardings.filter((o) => o.state == 1).length} / {userOnboardings.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {isEditing && (
            <Card>
              <CardHeader>
                <CardTitle>Asignar Onboardings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {onboardings.map((onboarding) => (
                    <div key={onboarding.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`onboarding-${onboarding.id}`}
                        checked={selectedOnboardings.includes(onboarding.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedOnboardings([...selectedOnboardings, onboarding.id])
                          } else {
                            setSelectedOnboardings(selectedOnboardings.filter((id) => id !== onboarding.id))
                          }
                        }}
                      />
                      <label
                        htmlFor={`onboarding-${onboarding.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {onboarding.name} ({onboarding.onboarding_type})
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Onboardings Asignados</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground text-center py-4">Cargando onboardings...</p>
              ) : userOnboardings.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No hay onboardings asignados a este usuario</p>
              ) : (
                <div className="space-y-3">
                  {userOnboardings.map((onboarding) => (
                    <div
                      key={onboarding.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: onboarding.color }} />
                          <h4 className="font-semibold text-foreground">{onboarding.name}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{onboarding.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(onboarding.start_date)} - {formatDate(onboarding.end_date)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-medium ${onboarding.state == 1 ? "text-green-600" : "text-yellow-600"}`}
                        >
                          {onboarding.state == 1 ? "Completado" : "Pendiente"}
                        </span>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant={onboarding.state == 1 ? "default" : "outline"}
                            onClick={() => handleToggleOnboardingState(onboarding.id, onboarding.state)}
                            className="w-8 h-8 p-0"
                          >
                            <FiCheck className={onboarding.state == 1 ? "text-white" : "text-green-600"} />
                          </Button>
                          <Button
                            size="sm"
                            variant={onboarding.state == 0 ? "destructive" : "outline"}
                            onClick={() => handleToggleOnboardingState(onboarding.id, onboarding.state)}
                            className="w-8 h-8 p-0"
                          >
                            <FiX />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
