"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FiCheckCircle, FiUsers, FiCalendar, FiBarChart } from "react-icons/fi";
import { useTheme } from "next-themes";
import { FiMoon, FiSun } from "react-icons/fi";

const features = [
    {
        icon: FiUsers,
        title: "Gestión de Colaboradores",
        description:
            "Administra y da seguimiento a todos los colaboradores en proceso de onboarding.",
        color: "#003473",
    },
    {
        icon: FiCalendar,
        title: "Calendario Integrado",
        description:
            "Visualiza todos los eventos de onboarding en un calendario completo.",
        color: "#EBB932",
    },
    {
        icon: FiBarChart,
        title: "Seguimiento en Tiempo Real",
        description:
            "Monitorea el progreso de cada colaborador y sus actividades asignadas.",
        color: "#CD3232",
    },
    {
        icon: FiCheckCircle,
        title: "Control Total",
        description:
            "Gestiona múltiples onboardings y personaliza según las necesidades.",
        color: "#003473",
    },
];

export default function LandingPage() {
    const router = useRouter();
    const { theme, setTheme } = useTheme();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <header className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#003473] to-[#0047a0] h-24 transform -skew-y-1 origin-top-left"></div>
                <div className="relative container mx-auto px-6 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#EBB932] rounded-full blur-lg opacity-40"></div>
                            <Image
                                src="/logo_bb.png"
                                alt="Banco de Bogotá"
                                width={56}
                                height={56}
                                className="rounded-full relative border-2 border-white shadow-xl"
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">
                                Banco de Bogotá
                            </h1>
                            <p className="text-sm text-blue-100 font-medium">
                                Sistema de Onboarding
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() =>
                                setTheme(theme === "dark" ? "light" : "dark")
                            }
                            className="p-2.5 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20 mb-3"
                        >
                            {theme === "dark" ? (
                                <FiSun className="w-5 h-5 text-white" />
                            ) : (
                                <FiMoon className="w-5 h-5 text-white" />
                            )}
                        </button>
                        <Button
                            variant="outline"
                            onClick={() => router.push("/login")}
                            className="bg-white/95 hover:bg-white text-[#003473] border-0 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 mb-3"
                        >
                            Iniciar Sesión
                        </Button>
                    </div>
                </div>
            </header>

            <section className="container mx-auto px-6 pt-20 pb-24 lg:pt-28 lg:pb-32">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-block mb-6">
                            <span className="px-4 py-2 rounded-full text-sm font-semibold text-[#003473] bg-[#EBB932]/20 border-2 border-[#EBB932]">
                                Sistema Integral de Gestión
                            </span>
                        </div>
                        <h2 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            <span className="text-[#003473] dark:text-blue-400">
                                Onboarding
                            </span>
                            <br />
                            <span className="text-slate-700 dark:text-slate-300">
                                Efectivo
                            </span>
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-xl">
                            Plataforma diseñada para optimizar la incorporación
                            de nuevos colaboradores. Gestiona procesos,
                            monitorea avances y mejora la experiencia desde el
                            primer día.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                size="lg"
                                onClick={() => router.push("/register")}
                                className="text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-[#003473] to-[#0047a0] hover:from-[#002a5c] hover:to-[#003473] border-0"
                            >
                                Comenzar Ahora
                                <span className="ml-2">→</span>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => router.push("/login")}
                                className="text-lg font-semibold border-2 border-[#003473] text-[#003473] hover:bg-[#003473] hover:text-white transition-all duration-300"
                            >
                                Iniciar Sesión
                            </Button>
                        </div>
                    </div>

                    <div className="hidden lg:block relative">
                        <div className="relative w-full h-96">
                            <div className="absolute top-0 right-0 w-72 h-72 bg-[#003473] rounded-3xl transform rotate-6 opacity-10"></div>
                            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#EBB932] rounded-3xl transform -rotate-6 opacity-10"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#CD3232] rounded-full opacity-5"></div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 lg:py-32 bg-white dark:bg-slate-900 relative">
                <div className="container mx-auto px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-20 relative">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-2 h-16 bg-gradient-to-b from-[#003473] via-[#EBB932] to-[#CD3232] rounded-full"></div>
                                <div>
                                    <h3 className="text-5xl lg:text-6xl font-bold text-[#003473] dark:text-blue-400">
                                        Potencia tu Gestión
                                    </h3>
                                    <p className="text-xl text-slate-600 dark:text-slate-400 mt-2">
                                        Herramientas que marcan la diferencia
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-24">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                const isEven = index % 2 === 0;

                                return (
                                    <div
                                        key={index}
                                        className={`flex flex-col lg:flex-row gap-12 items-center ${
                                            isEven ? "" : "lg:flex-row-reverse"
                                        }`}
                                    >
                                        <div className="flex-1 space-y-6">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg"
                                                    style={{
                                                        backgroundColor:
                                                            feature.color,
                                                    }}
                                                >
                                                    <Icon className="w-7 h-7 text-white" />
                                                </div>
                                                <span className="text-7xl font-bold text-slate-200 dark:text-slate-800">
                                                    0{index + 1}
                                                </span>
                                            </div>

                                            <h4 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                                                {feature.title}
                                            </h4>

                                            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                                                {feature.description}
                                            </p>

                                            <div
                                                className="w-20 h-1.5 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        feature.color,
                                                }}
                                            ></div>
                                        </div>

                                        <div className="flex-1 relative">
                                            <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden">
                                                <div
                                                    className="absolute inset-0 opacity-10"
                                                    style={{
                                                        background: `linear-gradient(135deg, ${feature.color} 0%, transparent 100%)`,
                                                    }}
                                                ></div>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div
                                                        className="w-48 h-48 rounded-full opacity-20 blur-2xl"
                                                        style={{
                                                            backgroundColor:
                                                                feature.color,
                                                        }}
                                                    ></div>
                                                    <Icon
                                                        className="absolute w-32 h-32 opacity-10"
                                                        style={{
                                                            color: feature.color,
                                                        }}
                                                    />
                                                </div>

                                                <div
                                                    className="absolute inset-0"
                                                    style={{
                                                        backgroundImage: `radial-gradient(${feature.color} 1px, transparent 1px)`,
                                                        backgroundSize:
                                                            "20px 20px",
                                                        opacity: 0.1,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-gradient-to-r from-[#003473] to-[#0047a0] relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-[#EBB932] rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#CD3232] rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto px-6 relative">
                    <div className="grid md:grid-cols-3 gap-12 text-center">
                        <div className="space-y-3">
                            <div className="text-6xl font-bold text-[#EBB932]">
                                100%
                            </div>
                            <div className="text-xl text-blue-100 font-medium">
                                Digital
                            </div>
                            <p className="text-blue-200 text-sm">
                                Proceso completamente digitalizado
                            </p>
                        </div>
                        <div className="space-y-3">
                            <div className="text-6xl font-bold text-[#EBB932]">
                                24/7
                            </div>
                            <div className="text-xl text-blue-100 font-medium">
                                Disponibilidad
                            </div>
                            <p className="text-blue-200 text-sm">
                                Acceso en cualquier momento
                            </p>
                        </div>
                        <div className="space-y-3">
                            <div className="text-6xl font-bold text-[#EBB932]">
                                ∞
                            </div>
                            <div className="text-xl text-blue-100 font-medium">
                                Escalabilidad
                            </div>
                            <p className="text-blue-200 text-sm">
                                Crece con tu organización
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 lg:py-32 bg-slate-50 dark:bg-slate-950">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#003473]/10 border border-[#003473]/20">
                                        <div className="w-2 h-2 rounded-full bg-[#EBB932] animate-pulse"></div>
                                        <span className="text-sm font-semibold text-[#003473] dark:text-blue-400">
                                            Empieza hoy mismo
                                        </span>
                                    </div>

                                    <h3 className="text-4xl lg:text-5xl font-bold leading-tight">
                                        <span className="text-[#003473] dark:text-blue-400">
                                            Simplifica
                                        </span>
                                        <br />
                                        <span className="text-slate-700 dark:text-slate-300">
                                            el proceso de integración
                                        </span>
                                    </h3>
                                </div>

                                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Descubre cómo nuestra plataforma revoluciona
                                    la experiencia de onboarding, reduciendo
                                    tiempos y aumentando la satisfacción de tus
                                    colaboradores desde el primer día.
                                </p>

                                <div className="space-y-4">
                                    {[
                                        {
                                            text: "Configuración rápida en minutos",
                                            icon: "⚡",
                                        },
                                        {
                                            text: "Sin costos de implementación",
                                            icon: "💰",
                                        },
                                        {
                                            text: "Soporte técnico especializado",
                                            icon: "🛠️",
                                        },
                                    ].map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-3"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-[#EBB932]/20 flex items-center justify-center text-xl">
                                                {item.icon}
                                            </div>
                                            <span className="text-slate-700 dark:text-slate-300 font-medium">
                                                {item.text}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <Button
                                        size="lg"
                                        onClick={() => router.push("/register")}
                                        className="text-lg font-semibold bg-[#003473] hover:bg-[#002a5c] text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-8"
                                    >
                                        Crear cuenta gratis
                                        <span className="ml-2">→</span>
                                    </Button>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#003473] to-[#0047a0] p-12 shadow-2xl">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#EBB932] opacity-20 rounded-full blur-3xl"></div>
                                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#CD3232] opacity-20 rounded-full blur-3xl"></div>

                                    <div className="relative space-y-6 text-white">
                                        <div className="text-5xl font-bold mb-8">
                                            Únete a la transformación digital
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                                <div className="text-3xl font-bold text-[#EBB932] mb-2">
                                                    50%
                                                </div>
                                                <div className="text-sm text-blue-100">
                                                    Menos tiempo
                                                </div>
                                            </div>
                                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                                <div className="text-3xl font-bold text-[#EBB932] mb-2">
                                                    95%
                                                </div>
                                                <div className="text-sm text-blue-100">
                                                    Satisfacción
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="bg-[#003473] dark:bg-slate-950 text-white py-16">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Image
                                    src="/logo_bb.png"
                                    alt="Banco de Bogotá"
                                    width={48}
                                    height={48}
                                    className="rounded-lg"
                                />
                                <div>
                                    <h4 className="font-bold text-lg">
                                        Banco de Bogotá
                                    </h4>
                                    <p className="text-sm text-blue-200">
                                        Sistema de Onboarding
                                    </p>
                                </div>
                            </div>
                            <p className="text-blue-200 text-sm leading-relaxed">
                                Cambiando contigo.
                            </p>
                        </div>

                        <div>
                            <h5 className="font-bold text-lg mb-4 text-[#EBB932]">
                                Plataforma
                            </h5>
                            <ul className="space-y-2 text-blue-200 text-sm">
                                <li>
                                    <p className="hover:text-white transition-colors">
                                        Funcionalidades
                                    </p>
                                </li>
                                <li>
                                    <p className="hover:text-white transition-colors">
                                        Integraciones
                                    </p>
                                </li>
                                <li>
                                    <p className="hover:text-white transition-colors">
                                        Seguridad
                                    </p>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h5 className="font-bold text-lg mb-4 text-[#EBB932]">
                                Recursos
                            </h5>
                            <ul className="space-y-2 text-blue-200 text-sm">
                                <li>
                                    <p className="hover:text-white transition-colors">
                                        Documentación
                                    </p>
                                </li>
                                <li>
                                    <p className="hover:text-white transition-colors">
                                        Guías
                                    </p>
                                </li>
                                <li>
                                    <p className="hover:text-white transition-colors">
                                        Blog
                                    </p>
                                </li>
                                <li>
                                    <p className="hover:text-white transition-colors">
                                        Soporte
                                    </p>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h5 className="font-bold text-lg mb-4 text-[#EBB932]">
                                Empresa
                            </h5>
                            <ul className="space-y-2 text-blue-200 text-sm">
                                <li>
                                    <a
                                        href="https://github.com/JuanDavid-Mendoza"
                                        className="hover:text-white transition-colors"
                                    >
                                        Acerca de
                                    </a>
                                </li>
                                <li>
                                    <p className="hover:text-white transition-colors">
                                        Carreras
                                    </p>
                                </li>
                                <li>
                                    <a
                                        href="https://github.com/JuanDavid-Mendoza"
                                        className="hover:text-white transition-colors"
                                    >
                                        Contacto
                                    </a>
                                </li>
                                <li>
                                    <p className="hover:text-white transition-colors">
                                        Legal
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-blue-400/20 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-blue-200 text-sm">
                                &copy; 2025 Banco de Bogotá. Todos los derechos
                                reservados.
                            </p>
                            <div className="flex gap-6 text-sm text-blue-200">
                                <p className="hover:text-white transition-colors">
                                    Privacidad
                                </p>
                                <p className="hover:text-white transition-colors">
                                    Términos
                                </p>
                                <p className="hover:text-white transition-colors">
                                    Cookies
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
