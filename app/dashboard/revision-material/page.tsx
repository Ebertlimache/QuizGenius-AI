'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import PrivateRoute from '@/components/PrivateRoute';
import { updateMaterialStatus } from '@/lib/user-utils';
import { User } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, XCircle } from "lucide-react";

export default function RevisionMaterialPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [materials, setMaterials] = useState<User['progress']['uploadedMaterials']>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<{
    userEmail: string;
    material: User['progress']['uploadedMaterials'][0];
  } | null>(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/dashboard');
      return;
    }

    // Aquí deberías cargar los materiales desde tu API
    // Por ahora usamos un array vacío
    setMaterials([]);
  }, [user, router]);

  const handleStatusUpdate = (status: 'approved' | 'rejected') => {
    if (!selectedMaterial) return;
    
    updateMaterialStatus(
      selectedMaterial.userEmail,
      selectedMaterial.material.id,
      status,
      feedback
    );
    
    // Refresh the materials list
    setMaterials([]); // Aquí deberías recargar los materiales desde tu API
    setSelectedMaterial(null);
    setFeedback('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Aprobado</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rechazado</Badge>;
      default:
        return <Badge className="bg-yellow-500">Pendiente</Badge>;
    }
  };

  return (
    <PrivateRoute>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Revisión de Material</h1>
          <p className="text-gray-500">Revisa y aprueba el material subido</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Lista de Material */}
          <Card>
            <CardHeader>
              <CardTitle>Material Pendiente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {materials.map((material) => (
                  <div
                    key={material.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedMaterial({ userEmail: user!.email, material })}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{material.title}</h3>
                      </div>
                      {getStatusBadge(material.status)}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Fecha: {new Date(material.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Panel de Revisión */}
          {selectedMaterial && (
            <Card>
              <CardHeader>
                <CardTitle>Revisar Material</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">{selectedMaterial.material.title}</h3>
                    <p className="text-sm text-gray-500">
                      Subido el {new Date(selectedMaterial.material.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Feedback</label>
                    <Textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Escribe tu feedback aquí..."
                      className="mt-1"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleStatusUpdate('approved')}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Aprobar
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleStatusUpdate('rejected')}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Rechazar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PrivateRoute>
  );
} 