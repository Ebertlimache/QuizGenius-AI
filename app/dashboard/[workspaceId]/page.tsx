'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import PrivateRoute from '@/components/PrivateRoute';
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, FileText, Brain, BarChart, User, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from '@/lib/utils';
import { Workspace } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const API_URL = "http://localhost:8000/api/v1";

export default function WorkspaceDashboardPage() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const params = useParams();
  const router = useRouter();
  
  const workspaceId = params.workspaceId as string;

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Si workspaceId no está disponible en el primer render, el efecto no hará nada.
    // Se volverá a ejecutar cuando workspaceId cambie de undefined a un valor real.
    if (!workspaceId) {
      return; 
    }

    const fetchWorkspaceDetails = async () => {
      // No necesitamos setIsLoading(true) aquí, ya está en true por defecto.
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/workspaces/${workspaceId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          router.push('/choose-topics');
          return;
        }

        const data: Workspace = await response.json();
        setWorkspace(data);
      } catch (error) {
        console.error("Error fetching workspace details:", error);
        router.push('/choose-topics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspaceDetails();
  }, [workspaceId, router]); // El array de dependencias es correcto

  // --- LA SOLUCIÓN PRINCIPAL ESTÁ AQUÍ ---
  // Mostramos el estado de carga si la data de la API está cargando O si el workspaceId aún no está disponible.
  // Esto previene que el resto del componente intente usar un `workspaceId` indefinido.
  if (isLoading || !workspaceId) {
    return <div className="flex justify-center items-center min-h-screen">Cargando Workspace...</div>;
  }

  // Ahora que hemos pasado el guardia de carga, estamos 100% seguros de que `workspaceId` tiene un valor.
  // Por lo tanto, es seguro definir los items del menú aquí.
  const dashboardItems = [
    {
      id: 1,
      title: "Subir Material",
      description: "Sube tus materiales para generar contenido de aprendizaje",
      icon: FileText,
      href: `/dashboard/${workspaceId}/upload`,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      darkBgColor: "bg-blue-900/30"
    },
    {
      id: 2,
      title: "Flashcards",
      description: "Practica con tarjetas de memoria para mejorar tu retención",
      icon: Brain,
      href: `/dashboard/${workspaceId}/flashcards`,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      darkBgColor: "bg-purple-900/30"
    },
    {
      id: 3,
      title: "Cuestionarios",
      description: "Pon a prueba tus conocimientos con cuestionarios interactivos",
      icon: BookOpen,
      href: `/dashboard/${workspaceId}/quizzes`,
      color: "text-green-600",
      bgColor: "bg-green-100",
      darkBgColor: "bg-green-900/30"
    },
    {
      id: 4,
      title: "Progreso",
      description: "Visualiza tu progreso y obtén recomendaciones",
      icon: BarChart,
      href: `/dashboard/${workspaceId}/progreso`,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      darkBgColor: "bg-orange-900/30"
    }
  ];

  return (
    <PrivateRoute>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>
                {workspace?.title || 'Dashboard'}
              </h1>
              <p className='text-gray-500 dark:text-gray-400'>
                {workspace?.description || 'Bienvenido a tu centro de aprendizaje personalizado.'}
              </p>
            </div>
            
            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={() => {
                    logout();
                    router.push('/login');
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dashboardItems.map((item) => (
              <Card
                key={item.id}
                className='flex flex-col bg-white dark:bg-black dark:border-gray-700'
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={cn('rounded-full p-2', theme === 'dark' ? item.darkBgColor : item.bgColor)}>
                      <item.icon className={cn(item.color, 'h-5 w-5')} />
                    </div>
                  </div>
                  <CardTitle className='mt-2 text-gray-900 dark:text-white'>{item.title}</CardTitle>
                  <CardDescription className='text-gray-500 dark:text-gray-400'>{item.description}</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto">
                  <Button className='w-full bg-gray-900 text-white dark:bg-gray-800 dark:hover:bg-gray-700' asChild>
                    <Link href={item.href}>Acceder</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </PrivateRoute>
  );
}