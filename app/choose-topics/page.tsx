"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Brain, BookOpen, Calculator, Globe, Microscope, History, Code, Music } from "lucide-react";

const topics = [
  {
    id: 'matematicas',
    name: 'Matemáticas',
    description: 'Álgebra, cálculo, geometría y más',
    icon: Calculator,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    id: 'ciencias',
    name: 'Ciencias',
    description: 'Física, química, biología',
    icon: Microscope,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    id: 'historia',
    name: 'Historia',
    description: 'Historia mundial y local',
    icon: History,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  {
    id: 'literatura',
    name: 'Literatura',
    description: 'Análisis literario y escritura',
    icon: BookOpen,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    id: 'programacion',
    name: 'Programación',
    description: 'Desarrollo web y software',
    icon: Code,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100'
  },
  {
    id: 'idiomas',
    name: 'Idiomas',
    description: 'Inglés, español y más',
    icon: Globe,
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  },
  {
    id: 'musica',
    name: 'Música',
    description: 'Teoría musical y práctica',
    icon: Music,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100'
  }
];

export default function ChooseTopicsPage() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
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
                    <div className={`rounded-full ${topic.bgColor} p-1.5`}>
                      <topic.icon className={`h-4 w-4 ${topic.color}`} />
                    </div>
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