import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/contexts/auth-context"
import { DataProvider } from "@/contexts/data-context"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sistema de Gestión de Onboardings - Banco de Bogotá",
  description: "Sistema completo para gestionar el proceso de onboarding de colaboradores",
  generator: "onboarding-app-frontend",
  icons: {
    icon: [
      {
        url: "/logo_bb.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/logo_bb.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/logo_bb.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/logo_bb.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <DataProvider>{children}</DataProvider>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
