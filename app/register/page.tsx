"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ApiService } from "@/api/api-backend"
import { useAuth } from "@/contexts/auth-context"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useTheme } from "next-themes"
import { FiMoon, FiSun, FiEye, FiEyeOff } from "react-icons/fi"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

const registerSchema = Yup.object().shape({
  name: Yup.string().required("El nombre es requerido"),
  email: Yup.string().email("Debe ser un correo válido").required("El correo es requerido"),
  password: Yup.string()
    .min(8, "Debe tener al menos 8 caracteres")
    .matches(/[A-Z]/, "Debe contener al menos una mayúscula")
    .matches(/[0-9]/, "Debe contener al menos un número")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Debe contener al menos un símbolo")
    .required("La contraseña es requerida"),
})

export default function RegisterPage() {
  const router = useRouter()
  const { isAuthenticated, user, loading } = useAuth()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      if (user.role_id == 1) {
        router.push("/dashboard")
      } else {
        router.push("/collaborator/onboardings")
      }
    }
  }, [isAuthenticated, user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  const handleSubmit = async (values: { name: string; email: string; password: string }) => {
    setIsLoading(true)

    try {
      const response = await ApiService.register({
        name: values.name,
        email: values.email,
        password: values.password,
        role_id: 2,
      })

      toast({
        title: "Registro exitoso",
        description: "Te has registrado exitosamente. Redirigiendo...",
      })

      setTimeout(() => {
        window.location.href = "/collaborator/onboardings"
      }, 1000)
    } catch (error) {
      toast({
        title: "Error en el registro",
        description: "No se pudo completar el registro. Por favor, intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Toaster />
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="fixed top-4 right-4 p-2 rounded-lg hover:bg-accent transition-colors"
      >
        {theme === "dark" ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
      </button>

      <Card className="w-full max-w-md border-border">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <Image src="/logo_bb.png" alt="Banco de Bogotá" width={80} height={80} className="rounded" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold" style={{ color: "#003DA5" }}>
              Registro de Colaboradores
            </CardTitle>
            <CardDescription>Completa el formulario para crear tu cuenta</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={{ name: "", email: "", password: "" }}
            validationSchema={registerSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Field
                    as={Input}
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Juan Pérez"
                    className={errors.name && touched.name ? "border-destructive" : ""}
                  />
                  <ErrorMessage name="name" component="p" className="text-sm text-destructive" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="usuario@bancobogota.com"
                    className={errors.email && touched.email ? "border-destructive" : ""}
                  />
                  <ErrorMessage name="email" component="p" className="text-sm text-destructive" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={errors.password && touched.password ? "border-destructive pr-10" : "pr-10"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  </div>
                  <ErrorMessage name="password" component="p" className="text-sm text-destructive" />
                  <p className="text-xs text-muted-foreground">
                    Mínimo 8 caracteres, 1 mayúscula, 1 número y 1 símbolo
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading} style={{ backgroundColor: "#003DA5" }}>
                  {isLoading ? "Registrando..." : "Registrarse"}
                </Button>
              </Form>
            )}
          </Formik>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="font-medium hover:underline" style={{ color: "#003DA5" }}>
                Inicia sesión aquí
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:underline">
              Volver al inicio
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
