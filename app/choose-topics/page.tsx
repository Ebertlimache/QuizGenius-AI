"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Brain, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Workspace } from "@/lib/types";

const API_URL = "http://localhost:8000/api/v1";

export default function ChooseTopicsPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [newWorkspaceTitle, setNewWorkspaceTitle] = useState('');
  const [newWorkspaceDescription, setNewWorkspaceDescription] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/workspaces/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al cargar los espacios de trabajo');
        }

        const data = await response.json();
        setWorkspaces(data);
      } catch (err) {
        setError('Error al cargar los espacios de trabajo');
        console.error(err);
      }
    };

    fetchWorkspaces();
  }, []);

  const handleAddWorkspace = async () => {
    if (newWorkspaceTitle.trim()) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/workspaces/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: newWorkspaceTitle,
            description: newWorkspaceDescription
          })
        });

        if (!response.ok) {
          throw new Error('Error al crear el espacio de trabajo');
        }

        const newWorkspace = await response.json();
        setWorkspaces([...workspaces, newWorkspace]);
        setNewWorkspaceTitle('');
        setNewWorkspaceDescription('');
        setIsDialogOpen(false);
      } catch (err) {
        setError('Error al crear el espacio de trabajo');
        console.error(err);
      }
    }
  };
  
  // Nueva función para manejar el clic en un workspace
  const handleWorkspaceClick = (workspaceId: number) => {
    // Redirige al dashboard respectivo.
    // Usamos el ID del workspace en la URL.
    //router.push(`/dashboard`);
    router.push(`/dashboard/${workspaceId}`);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-2">
              <Brain className="h-8 w-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Elige tu espacio de trabajo
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Selecciona un espacio para comenzar a estudiar.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-md border border-red-200 mb-4">
              {error}
            </div>
          )}

          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {workspaces.map((workspace) => (
              <Card 
                key={workspace.id}
                // Añadimos el evento onClick directamente a la tarjeta
                onClick={() => handleWorkspaceClick(workspace.id)}
                className="relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:ring-2 hover:ring-indigo-500 cursor-pointer"
              >
                <CardHeader className="p-4">
                  {/* Ya no necesitamos el checkbox */}
                  <CardTitle className="text-base mt-2">{workspace.title}</CardTitle>
                  <CardDescription className="text-xs">{workspace.description || 'Sin descripción'}</CardDescription>
                </CardHeader>
              </Card>
            ))}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer">
                  <CardHeader className="p-4 flex items-center justify-center h-full">
                    <div className="flex flex-col items-center gap-2">
                      <Plus className="h-6 w-6 text-gray-400" />
                      <span className="text-sm text-gray-500">Agregar espacio</span>
                    </div>
                  </CardHeader>
                </Card>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar nuevo espacio de trabajo</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={newWorkspaceTitle}
                      onChange={(e) => setNewWorkspaceTitle(e.target.value)}
                      placeholder="Ingresa el título del espacio"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Input
                      id="description"
                      value={newWorkspaceDescription}
                      onChange={(e) => setNewWorkspaceDescription(e.target.value)}
                      placeholder="Ingresa una descripción"
                    />
                  </div>
                  <Button onClick={handleAddWorkspace}>Agregar espacio</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* La barra inferior con el botón de "Continuar" ha sido eliminada */}
    </div>
  );
} 