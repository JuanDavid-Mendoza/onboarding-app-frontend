# Onboarding App Frontend

Aplicación de gestión de onboardings construida con Next.js 14, TypeScript y React.

## Descripción

Sistema de gestión de onboardings que permite a administradores y colaboradores gestionar procesos de incorporación de nuevos empleados, con funcionalidades de calendario, seguimiento de actividades y gestión de usuarios.

## Arquitectura

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilización**: Tailwind CSS
- **Estado Global**: React Context API
- **Gestión de Formularios**: React Hook Form
- **Testing**: Jest + React Testing Library
- **Gestor de Paquetes**: pnpm

### Estructura del Proyecto

```
onboarding-app-frontend/
├── app/                    # Rutas y páginas (Next.js App Router)
│   ├── calendar/          # Vista de calendario
│   ├── collaborator/      # Vistas del colaborador
│   ├── dashboard/         # Dashboard principal
│   ├── login/             # Autenticación
│   ├── onboardings/       # Gestión de onboardings
│   └── register/          # Registro de usuarios
├── api/                    # Capa de comunicación con backend
│   ├── services/          # Servicios de API
│   ├── types/             # Tipos TypeScript
│   └── utils/             # Utilidades HTTP y tokens
├── components/            # Componentes reutilizables
│   └── ui/                # Componentes de UI base
├── contexts/              # Contextos de React (Auth, Data)
├── hooks/                 # Custom hooks
├── lib/                   # Utilidades y helpers
└── styles/                # Estilos globales
```

## Instalación

### Prerequisitos

- Node.js 18+ ([Descargar](https://nodejs.org/))
- pnpm 8+ ([Instalar](https://pnpm.io/installation))

### Pasos

1. **Clonar el repositorio**

```bash
git clone <url-del-repositorio>
cd onboarding-app-frontend
```

2. **Instalar dependencias**

```bash
pnpm install
```

3. **Configurar variables de entorno**

Crear un archivo `.env` en la raíz del proyecto basándose en `.env.example`:

```bash
cp .env.example .env
```

Editar el archivo `.env` y configurar:

```env
# API Backend URL
API_URL=http://localhost:3001
```

## Ejecución

### Modo Desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### Modo Producción

```bash
# Construir
pnpm build

# Ejecutar
pnpm start
```

### Linting

```bash
pnpm lint
```

## Testing

Ejecutar tests:

```bash
# Todos los tests
pnpm test

# Tests en modo watch
pnpm test:watch

# Coverage
pnpm test:coverage
```

Tests disponibles:
- `app/dashboard/__tests__/page.test.tsx`
- `app/login/__tests__/page.test.tsx`
- `app/onboardings/__tests__/page.test.tsx`
- `app/register/__tests__/page.test.tsx`

## 📦 Características Principales

### Módulos

- **Autenticación**: Sistema de login/registro (`app/login/page.tsx`, `app/register/page.tsx`)
- **Dashboard**: Vista general del sistema (`app/dashboard/page.tsx`)
- **Onboardings**: Gestión completa de procesos de onboarding (`app/onboardings/page.tsx`)
- **Calendario**: Visualización de eventos y actividades (`app/calendar/page.tsx`)
- **Vista Colaborador**: Portal específico para colaboradores (`app/collaborator/`)

### Servicios API

- `api/services/auth.service.ts` - Autenticación
- `api/services/user.service.ts` - Gestión de usuarios
- `api/services/onboarding.service.ts` - Gestión de onboardings
- `api/services/user-onboarding.service.ts` - Relación usuario-onboarding

### Contextos

- `contexts/auth-context.tsx` - Estado de autenticación
- `contexts/data-context.tsx` - Estado global de datos

## Autenticación

El sistema utiliza tokens JWT para autenticación. La gestión de tokens se maneja en:
- `api/utils/token-manager.ts`
- `api/utils/http-client.ts`

Las rutas protegidas utilizan el componente `components/protected-route.tsx`.

## Componentes UI

Basados en Radix UI y Tailwind CSS. Ver componentes en `components/ui`:
- Botones, Inputs, Selects
- Modales y Diálogos
- Tablas y Cards
- Forms y Validaciones
- Toast notifications

## Tecnologías

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilización utility-first
- **Radix UI** - Componentes accesibles
- **React Hook Form** - Gestión de formularios
- **Jest** - Testing framework
- **Sonner** - Toast notifications

## Scripts Disponibles

```json
{
  "dev": "Ejecuta en modo desarrollo",
  "build": "Construye para producción",
  "start": "Inicia servidor de producción",
  "lint": "Ejecuta ESLint",
  "test": "Ejecuta tests con Jest"
}
```
