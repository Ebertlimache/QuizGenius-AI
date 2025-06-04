'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import PrivateRoute from '@/components/PrivateRoute';
import { getStudentsForDocente } from '@/lib/user-utils';
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

export default function ProgresoEstudiantesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState<User[]>([]);

  useEffect(() => {
    if (user?.role !== 'docente') {
      router.push('/dashboard');
      return;
    }

    const docenteStudents = getStudentsForDocente(user.email);
    setStudents(docenteStudents);
  }, [user, router]);

  const calculateAverageScore = (student: User) => {
    if (!student.progress?.quizzes?.length) return 0;
    const total = student.progress.quizzes.reduce((acc, quiz) => acc + quiz.score, 0);
    return total / student.progress.quizzes.length;
  };

  const calculateFlashcardProgress = (student: User) => {
    if (!student.progress?.flashcards?.length) return 0;
    const total = student.progress.flashcards.reduce((acc, set) => {
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