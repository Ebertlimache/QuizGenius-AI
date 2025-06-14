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

      {/* Desktop sidebar */}
      <div className={cn("hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:shadow-sm",
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')}>
        <div className={cn("flex h-16 items-center gap-2 border-b px-6",
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200')}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span className={cn("text-xl font-bold", theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            QuizGenius AI
          </span>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-4">
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
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Header */}
        <header className={cn("sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-4 shadow-sm",
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')}>
          {/* ... (el resto del header no necesita cambios) */}
        </header>

        {/* Main content area */}
        <main className={cn("flex-1 p-6", theme === 'dark' ? 'text-gray-100' : 'text-gray-900')}>
          {children}
        </main>
      </div>
    </div>
  )
}