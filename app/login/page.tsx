"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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

const loginSchema = Yup.object().shape({
  email: Yup.string().min(3, "Debe tener al menos 3 caracteres").required("Este campo es requerido"),
  password: Yup.string().required("La contraseña es requerida"),
})

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, user, loading } = useAuth()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      if (user.role_id == 1) {
        router.push("/dashboard")
      } else {
        router.push("/colaborador/mis-onboardings")
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

  const handleSubmit = async (values: { email: string; password: string }) => {
    setIsLoading(true)

    try {
      const success = await login(values.email, values.password)

      if (success) {
        const storedUser = localStorage.getItem("currentUser")
        if (storedUser) {
          const user = JSON.parse(storedUser)

          toast({
            title: "Inicio de sesión exitoso",
            description: "Bienvenido al sistema de gestión de onboardings",
          })

          if (user.role_id == 1) {
            router.push("/dashboard")
          } else {
            router.push("/colaborador/mis-onboardings")
          }
        }
      } else {
        toast({
          title: "Error de autenticación",
          description: "Credenciales incorrectas. Por favor, verifica tus datos.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error de autenticación",
        description: "Ocurrió un error al iniciar sesión. Intenta nuevamente.",
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
              Iniciar Sesión
            </CardTitle>
            <CardDescription>Ingresa tus credenciales para acceder al sistema</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Formik initialValues={{ email: "", password: "" }} validationSchema={loginSchema} onSubmit={handleSubmit}>
            {({ errors, touched }) => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo</Label>
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    type="text"
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
                </div>

                <Button type="submit" className="w-full" disabled={isLoading} style={{ backgroundColor: "#003DA5" }}>
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </Form>
            )}
          </Formik>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              ¿No tienes una cuenta?{" "}
              <Link href="/register" className="font-medium hover:underline" style={{ color: "#003DA5" }}>
                Regístrate aquí
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
