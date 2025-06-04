'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PrivateRoute from '@/components/PrivateRoute';
import { User } from '@/lib/types';
import { assignStudentToDocente } from '@/lib/user-utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [docentes, setDocentes] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario actual es admin
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (currentUser.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    // Cargar usuarios
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(storedUsers);
    setDocentes(storedUsers.filter((user: User) => user.role === 'docente'));
  }, [router]);

  const handleAssignDocente = (studentEmail: string, docenteEmail: string) => {
    assignStudentToDocente(studentEmail, docenteEmail);
    // Actualizar la lista de usuarios
    const updatedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(updatedUsers);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-500">Admin</Badge>;
      case 'docente':
        return <Badge className="bg-blue-500">Docente</Badge>;
      default:
        return <Badge className="bg-green-500">Estudiante</Badge>;
    }
  };

  return (
    <PrivateRoute>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Panel de Administración</h1>
          <p className="text-gray-500">Gestiona usuarios y asigna estudiantes a docentes</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Usuarios del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Docente Asignado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.email}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      {user.role === 'estudiante' ? (
                        <Select
                          value={user.assignedTo || ''}
                          onValueChange={(value) => handleAssignDocente(user.email, value)}
                        >
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Seleccionar docente" />
                          </SelectTrigger>
                          <SelectContent>
                            {docentes.map((docente) => (
                              <SelectItem key={docente.email} value={docente.email}>
                                {docente.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {user.role !== 'admin' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Implementar eliminación de usuario
                            const updatedUsers = users.filter((u) => u.email !== user.email);
                            localStorage.setItem('users', JSON.stringify(updatedUsers));
                            setUsers(updatedUsers);
                          }}
                        >
                          Eliminar
                        </Button>
                      )}
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