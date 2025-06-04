"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Subir Material", href: "/dashboard/upload", icon: Upload },
  { name: "Flashcards", href: "/dashboard/flashcards", icon: BookOpen },
  { name: "Cuestionarios", href: "/dashboard/quizzes", icon: FileQuestion },
  { name: "Progreso", href: "/dashboard/progreso-estudiantes", icon: BarChart3 },
  { name: "Configuración", href: "/dashboard/settings", icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
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
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className={cn("h-5 w-5", theme === 'dark' ? 'text-gray-400' : 'text-gray-500')} />
          </Button>

          <div className="ml-auto flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className={theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("relative", theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900')}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Usuario" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className={cn("w-56", theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white')} align="end">
                <DropdownMenuLabel className={cn("font-normal", theme === 'dark' ? 'text-gray-300' : 'text-gray-900')}>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Juan Pérez</p>
                    <p className={cn("text-xs leading-none", theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                      juan@ejemplo.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} />
                <DropdownMenuItem asChild className={theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : ''}>
                  <Link href="/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Configuración
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} />
                <DropdownMenuItem asChild className={theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : ''}>
                  <Link href="/login">
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main content area */}
        <main className={cn("flex-1 p-6", theme === 'dark' ? 'text-gray-100' : 'text-gray-900')}>
          {children}
        </main>
      </div>
    </div>
  )
}
