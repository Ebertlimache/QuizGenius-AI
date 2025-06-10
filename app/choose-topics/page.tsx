"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Brain, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const initialTopics = [
  {
    id: 'matematicas',
    name: 'Matemáticas',
    description: 'Álgebra, cálculo, geometría y más',
  },
  {
    id: 'ciencias',
    name: 'Ciencias',
    description: 'Física, química, biología',
  },
  {
    id: 'historia',
    name: 'Historia',
    description: 'Historia mundial y local',
  },
  {
    id: 'literatura',
    name: 'Literatura',
    description: 'Análisis literario y escritura',
  },
  {
    id: 'programacion',
    name: 'Programación',
    description: 'Desarrollo web y software',
  },
  {
    id: 'idiomas',
    name: 'Idiomas',
    description: 'Inglés, español y más',
  },
  {
    id: 'musica',
    name: 'Música',
    description: 'Teoría musical y práctica',
  }
];

export default function ChooseTopicsPage() {
  const [topics, setTopics] = useState(initialTopics);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicDescription, setNewTopicDescription] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleTopicToggle = (topicId: string) => {
    setSelectedTopics(prev => {
      if (prev.includes(topicId)) {
        return prev.filter(id => id !== topicId);
      } else {
        return [...prev, topicId];
      }
    });
  };

  const handleAddTopic = () => {
    if (newTopicName.trim() && newTopicDescription.trim()) {
      const newTopic = {
        id: newTopicName.toLowerCase().replace(/\s+/g, '-'),
        name: newTopicName,
        description: newTopicDescription,
      };
      setTopics([...topics, newTopic]);
      setNewTopicName('');
      setNewTopicDescription('');
      setIsDialogOpen(false);
    }
  };

  const handleContinue = () => {
    if (selectedTopics.length > 0) {
      // Aquí iría la lógica para guardar los temas seleccionados
      router.push('/dashboard');
    }
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
              Elige tus temas de interés
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Selecciona los temas que te gustaría estudiar. Podrás modificarlos más tarde.
            </p>
          </div>

          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {topics.map((topic) => (
              <Card 
                key={topic.id}
                className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg ${
                  selectedTopics.includes(topic.id) ? 'ring-2 ring-indigo-500' : ''
                }`}
              >
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <Checkbox
                      id={topic.id}
                      checked={selectedTopics.includes(topic.id)}
                      onCheckedChange={() => handleTopicToggle(topic.id)}
                      className="h-4 w-4"
                    />
                  </div>
                  <CardTitle className="text-base mt-2">{topic.name}</CardTitle>
                  <CardDescription className="text-xs">{topic.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer">
                  <CardHeader className="p-4 flex items-center justify-center h-full">
                    <div className="flex flex-col items-center gap-2">
                      <Plus className="h-6 w-6 text-gray-400" />
                      <span className="text-sm text-gray-500">Agregar tema</span>
                    </div>
                  </CardHeader>
                </Card>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar nuevo tema</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nombre del tema</Label>
                    <Input
                      id="name"
                      value={newTopicName}
                      onChange={(e) => setNewTopicName(e.target.value)}
                      placeholder="Ingresa el nombre del tema"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Input
                      id="description"
                      value={newTopicDescription}
                      onChange={(e) => setNewTopicDescription(e.target.value)}
                      placeholder="Ingresa una descripción"
                    />
                  </div>
                  <Button onClick={handleAddTopic}>Agregar tema</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="border-t bg-white p-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            {selectedTopics.length === 0
              ? 'Selecciona al menos un tema para continuar'
              : `Has seleccionado ${selectedTopics.length} tema${selectedTopics.length !== 1 ? 's' : ''}`}
          </p>
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={selectedTopics.length === 0}
            className="w-full sm:w-auto"
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
} 