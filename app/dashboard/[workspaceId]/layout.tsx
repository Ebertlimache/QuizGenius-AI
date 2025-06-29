"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Brain,
  LayoutDashboard,
  Upload,
  BookOpen,
  FileQuestion,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Moon,
  Sun,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const params = useParams();
  const { theme, setTheme } = useTheme();
  
  const [sidebarOpen, setSidebarOpen] = useState(false)
  

  const workspaceId = (params.workspaceId as string) || '';

  const navigation = [
    { name: "Dashboard", href: `/dashboard/${workspaceId}`, icon: LayoutDashboard },
    { name: "Subir Material", href: `/dashboard/${workspaceId}/upload`, icon: Upload },
    { name: "Flashcards", href: `/dashboard/${workspaceId}/flashcards`, icon: BookOpen },
    { name: "Cuestionarios", href: `/dashboard/${workspaceId}/quizzes`, icon: FileQuestion },
    { name: "Progreso", href: `/dashboard/${workspaceId}/progreso`, icon: BarChart3 },
    { name: "Configuración", href: `/dashboard/${workspaceId}/settings`, icon: Settings },
  ]

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }

  // Si no tenemos un workspaceId, podríamos mostrar un estado de carga o nada,
  // para evitar renderizar enlaces rotos.
  if (!workspaceId) {
    return <div className="flex justify-center items-center min-h-screen">Cargando layout...</div>;
  }

  return (
    <div className={cn("flex min-h-screen", theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50')}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden",
          theme === 'dark' ? 'bg-gray-800' : 'bg-white',
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className={cn("flex h-16 items-center justify-between px-4 border-b",
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200')}>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className={cn("text-xl font-bold", theme === 'dark' ? 'text-white' : 'text-gray-900')}>
              QuizGenius AI
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
            <X className={cn("h-5 w-5", theme === 'dark' ? 'text-gray-400' : 'text-gray-500')} />
          </Button>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href 
                  ? theme === 'dark' 
                    ? "bg-gray-700 text-white" 
                    : "bg-blue-50 text-blue-600"
                  : theme === 'dark'
                    ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                    : "text-gray-700 hover:bg-gray-100"
              )}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Sidebar compacto estilo Duolingo, más aireado */}
      <div className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-72 z-40 bg-white border-r shadow-lg py-8 px-6">
        <div className="mb-6 flex items-center justify-center">
          <span className="text-2xl font-extrabold text-blue-600 tracking-tight" style={{ fontFamily: 'Arial Rounded MT Bold, Arial, sans-serif' }}>QuizGenius</span>
        </div>
        <nav className="flex-1 flex flex-col gap-3">
          {navigation.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            const colorMap = {
              Dashboard: 'text-yellow-500',
              'Subir Material': 'text-pink-500',
              Flashcards: 'text-yellow-400',
              Cuestionarios: 'text-sky-500',
              Progreso: 'text-amber-500',
              Configuración: 'text-blue-500',
            };
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-base font-bold uppercase tracking-wide transition-all mb-1 shadow-sm",
                  active
                    ? "bg-blue-50 border-2 border-blue-300 text-blue-700 shadow-md"
                    : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                )}
                style={{ minHeight: 44 }}
              >
                <span className={cn(
                  "flex items-center justify-center rounded-full p-1.5",
                  active ? "bg-blue-100" : ""
                )}>
                  <Icon size={22} className={colorMap[item.name as keyof typeof colorMap] || 'text-blue-500'} />
                </span>
                <span className="ml-1">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-72">
        {/* Main content area */}
        <main className={cn("flex-1 p-6", theme === 'dark' ? 'text-gray-100' : 'text-gray-900')}>
          {children}
        </main>
      </div>
    </div>
  )
}