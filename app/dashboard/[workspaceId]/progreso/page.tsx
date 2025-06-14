'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import PrivateRoute from '@/components/PrivateRoute';
import { User } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// Datos mockeados
const mockStudents = [
  {
    id: 1,
    name: "Ana García",
    email: "ana.garcia@example.com",
    progress: {
      quizzes: [
        { id: 1, title: "Biología Celular", score: 85, date: "2024-03-15" },
        { id: 2, title: "Química Orgánica", score: 92, date: "2024-03-20" },
        { id: 3, title: "Historia Mundial", score: 78, date: "2024-03-25" }
      ],
      flashcards: [
        { id: 1, title: "Biología", knownCards: 45, totalCards: 50 },
        { id: 2, title: "Química", knownCards: 30, totalCards: 40 }
      ],
      uploadedMaterials: [
        { id: 1, title: "Resumen Biología", date: "2024-03-10" },
        { id: 2, title: "Notas Química", date: "2024-03-18" }
      ]
    }
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@example.com",
    progress: {
      quizzes: [
        { id: 1, title: "Biología Celular", score: 75, date: "2024-03-15" },
        { id: 2, title: "Química Orgánica", score: 88, date: "2024-03-20" }
      ],
      flashcards: [
        { id: 1, title: "Biología", knownCards: 35, totalCards: 50 },
        { id: 2, title: "Química", knownCards: 25, totalCards: 40 }
      ],
      uploadedMaterials: [
        { id: 1, title: "Resumen Biología", date: "2024-03-12" }
      ]
    }
  },
  {
    id: 3,
    name: "María López",
    email: "maria.lopez@example.com",
    progress: {
      quizzes: [
        { id: 1, title: "Biología Celular", score: 95, date: "2024-03-15" },
        { id: 2, title: "Química Orgánica", score: 90, date: "2024-03-20" },
        { id: 3, title: "Historia Mundial", score: 88, date: "2024-03-25" }
      ],
      flashcards: [
        { id: 1, title: "Biología", knownCards: 48, totalCards: 50 },
        { id: 2, title: "Química", knownCards: 38, totalCards: 40 }
      ],
      uploadedMaterials: [
        { id: 1, title: "Resumen Biología", date: "2024-03-10" },
        { id: 2, title: "Notas Química", date: "2024-03-18" },
        { id: 3, title: "Historia", date: "2024-03-22" }
      ]
    }
  }
];

// Datos para gráficas
const quizPerformanceData = [
  { name: 'Biología Celular', promedio: 85 },
  { name: 'Química Orgánica', promedio: 90 },
  { name: 'Historia Mundial', promedio: 83 }
];

const progressOverTimeData = [
  { name: 'Semana 1', quizzes: 75, flashcards: 60 },
  { name: 'Semana 2', quizzes: 82, flashcards: 70 },
  { name: 'Semana 3', quizzes: 88, flashcards: 85 },
  { name: 'Semana 4', quizzes: 92, flashcards: 90 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function ProgresoEstudiantesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState(mockStudents);

  const calculateAverageScore = (student: any) => {
    if (!student.progress?.quizzes?.length) return 0;
    const total = student.progress.quizzes.reduce((acc: number, quiz: any) => acc + quiz.score, 0);
    return total / student.progress.quizzes.length;
  };

  const calculateFlashcardProgress = (student: any) => {
    if (!student.progress?.flashcards?.length) return 0;
    const total = student.progress.flashcards.reduce((acc: number, set: any) => {
      return acc + (set.knownCards / set.totalCards);
    }, 0);
    return (total / student.progress.flashcards.length) * 100;
  };

  return (
    <PrivateRoute>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Progreso de Estudiantes</h1>
          <p className="text-gray-500">Monitorea el avance de tus estudiantes asignados</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento en Quizzes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={quizPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="promedio" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progreso General</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressOverTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="quizzes" stroke="#8884d8" />
                    <Line type="monotone" dataKey="flashcards" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Estudiantes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Promedio Quizzes</TableHead>
                  <TableHead>Progreso Flashcards</TableHead>
                  <TableHead>Material Subido</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.email}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{calculateAverageScore(student).toFixed(1)}%</span>
                        <Progress value={calculateAverageScore(student)} className="w-24" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{calculateFlashcardProgress(student).toFixed(1)}%</span>
                        <Progress value={calculateFlashcardProgress(student)} className="w-24" />
                      </div>
                    </TableCell>
                    <TableCell>
                      {student.progress?.uploadedMaterials?.length || 0} archivos
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PrivateRoute>
  );
} 