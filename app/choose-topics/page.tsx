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
import Image from 'next/image';

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
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-blue-400 overflow-hidden">
      {/* Fondo decorativo */}
      <Image src="/fondo.png" alt="Fondo" fill priority className="object-cover z-0" style={{opacity:0.18}} />
      {/* SVG decorativos */}
      <div className="absolute top-8 left-8 z-10 hidden md:block">
        <svg width="80" height="60" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="40" cy="30" rx="38" ry="18" fill="#FF7BAC"/>
          <ellipse cx="30" cy="30" rx="10" ry="16" fill="#fff" fillOpacity="0.5"/>
        </svg>
      </div>
      <div className="absolute bottom-8 right-8 z-10 hidden md:block">
        <svg width="80" height="60" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="40" cy="30" rx="38" ry="18" fill="#FF7BAC"/>
          <ellipse cx="50" cy="30" rx="10" ry="16" fill="#fff" fillOpacity="0.5"/>
        </svg>
      </div>
      <div className="absolute top-8 right-24 z-10 hidden md:block">
        <svg width="70" height="50" viewBox="0 0 70 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="50" height="30" rx="6" fill="#A0E9A3"/>
          <rect x="20" y="15" width="30" height="20" rx="3" fill="#fff" fillOpacity="0.7"/>
        </svg>
      </div>
      {/* Card principal de selección de espacios */}
      <div className="relative flex flex-col items-center w-full max-w-4xl z-20 mt-12 mb-12">
        <div className="flex flex-col items-center bg-white rounded-3xl shadow-lg px-6 py-8 w-full">
          <div className="flex flex-col items-center mb-6">
            <div className="rounded-full bg-indigo-100 flex items-center justify-center mb-2" style={{width:60, height:60}}>
              <Brain className="h-10 w-10 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-extrabold text-blue-900 mb-1 text-center">Elige tu espacio de trabajo</h1>
            <p className="text-base text-blue-700 text-center">Selecciona un espacio para comenzar a estudiar.</p>
          </div>
          {error && (
            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-md border border-red-200 mb-4">
              {error}
            </div>
          )}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full">
            {workspaces.map((workspace) => (
              <Card 
                key={workspace.id}
                onClick={() => handleWorkspaceClick(workspace.id)}
                className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-md transition-all duration-200 hover:shadow-xl hover:ring-2 hover:ring-indigo-500 cursor-pointer min-h-[140px]"
              >
                <CardHeader className="flex flex-col items-center p-0 mb-2">
                  <div className="rounded-full bg-indigo-50 flex items-center justify-center mb-2" style={{width:40, height:40}}>
                    <Brain className="h-6 w-6 text-indigo-500" />
                  </div>
                  <CardTitle className="text-lg font-bold text-blue-900 text-center">{workspace.title}</CardTitle>
                  <CardDescription className="text-xs text-gray-500 text-center">{workspace.description || 'Sin descripción'}</CardDescription>
                </CardHeader>
              </Card>
            ))}
            {/* Card para agregar espacio */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Card className="flex flex-col items-center justify-center p-6 bg-indigo-50 rounded-2xl shadow-md transition-all duration-200 hover:shadow-xl cursor-pointer min-h-[140px] border-2 border-dashed border-indigo-200">
                  <CardHeader className="flex flex-col items-center p-0">
                    <div className="flex flex-col items-center gap-2">
                      <Plus className="h-8 w-8 text-indigo-400" />
                      <span className="text-base text-indigo-600 font-semibold">Agregar espacio</span>
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
                  <Button onClick={handleAddWorkspace} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md rounded-xl mt-2">Agregar espacio</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
} 