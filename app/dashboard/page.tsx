'use client';

import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import PrivateRoute from '@/components/PrivateRoute';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Brain, BarChart } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useAuth();
  const { theme } = useTheme();

  const dashboardItems = [
    {
      id: 1,
      title: "Subir Material",
      description: "Sube tus materiales de estudio para generar contenido de aprendizaje",
      icon: FileText,
      href: "/dashboard/upload",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      darkBgColor: "bg-blue-900/30"
    },
    {
      id: 2,
      title: "Flashcards",
      description: "Practica con tarjetas de memoria para mejorar tu retención",
      icon: Brain,
      href: "/dashboard/flashcards",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      darkBgColor: "bg-purple-900/30"
    },
    {
      id: 3,
      title: "Cuestionarios",
      description: "Pon a prueba tus conocimientos con cuestionarios interactivos",
      icon: BookOpen,
      href: "/dashboard/quizzes",
      color: "text-green-600",
      bgColor: "bg-green-100",
      darkBgColor: "bg-green-900/30"
    },
    {
      id: 4,
      title: "Progreso",
      description: "Visualiza tu progreso y obtén recomendaciones personalizadas",
      icon: BarChart,
      href: "/dashboard/progreso-estudiantes",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      darkBgColor: "bg-orange-900/30"
    }
  ];

  return (
    <PrivateRoute>
      <div className={cn(
        'min-h-screen',
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      )}>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className={cn(
                  'text-3xl font-bold tracking-tight',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>Dashboard</h1>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                  Bienvenido a tu centro de aprendizaje personalizado.
                </p>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {dashboardItems.map((item) => (
                <Card
                  key={item.id}
                  className={cn(
                    'flex flex-col',
                    theme === 'dark' ? 'bg-black border-gray-700' : 'bg-white'
                  )}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className={cn(
                        'rounded-full p-2',
                        theme === 'dark' ? item.darkBgColor : item.bgColor
                      )}>
                        <item.icon className={item.color + ' h-5 w-5'} />
                      </div>
                    </div>
                    <CardTitle className={cn('mt-2', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                      {item.title}
                    </CardTitle>
                    <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button className={cn('w-full', theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : '')} asChild>
                      <Link href={item.href}>Acceder</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </PrivateRoute>
  );
}
