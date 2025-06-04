'use client';

import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import PrivateRoute from '@/components/PrivateRoute';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Brain, BarChart } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  const dashboardItems = [
    {
      id: 1,
      title: "Subir Material",
      description: "Sube tus materiales de estudio para generar contenido de aprendizaje",
      icon: FileText,
      href: "/dashboard/upload",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      id: 2,
      title: "Flashcards",
      description: "Practica con tarjetas de memoria para mejorar tu retención",
      icon: Brain,
      href: "/dashboard/flashcards",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      id: 3,
      title: "Cuestionarios",
      description: "Pon a prueba tus conocimientos con cuestionarios interactivos",
      icon: BookOpen,
      href: "/dashboard/quizzes",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      id: 4,
      title: "Progreso",
      description: "Visualiza tu progreso y obtén recomendaciones personalizadas",
      icon: BarChart,
      href: "/dashboard/progreso-estudiantes",
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gray-50">
        

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-gray-500">Bienvenido a tu centro de aprendizaje personalizado.</p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {dashboardItems.map((item) => (
                <Card key={item.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className={`rounded-full ${item.bgColor} p-2`}>
                        <item.icon className={`h-4 w-4 ${item.color}`} />
                      </div>
                    </div>
                    <CardTitle className="mt-2">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button className="w-full" asChild>
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
