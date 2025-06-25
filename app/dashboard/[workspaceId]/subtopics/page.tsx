'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, BrainCircuit, School } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SubtopicInfo {
  subtopic_id: number;
  subtopic_title: string;
  key_concepts: string[];
  flashcards_count: number;
  quizzes_count: number;
}

const API_URL = "http://localhost:8000/api/v1";

export default function SubtopicsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  const [subtopics, setSubtopics] = useState<SubtopicInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubtopics = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/workspaces/${workspaceId}/subtopics`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch subtopics');
        }

        const data = await response.json();
        setSubtopics(data);
      } catch (error) {
        console.error('Error fetching subtopics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubtopics();
  }, [workspaceId]);

  const navigateToFlashcards = (subtopicId: number) => {
    router.push(`/dashboard/${workspaceId}/flashcards/${subtopicId}`);
  };

  const navigateToQuizzes = (subtopicId: number) => {
    router.push(`/dashboard/${workspaceId}/quizzes/${subtopicId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando subtemas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Subtemas</h1>
        <p className="text-gray-500 mt-2">
          Explora los subtemas extraídos de tus materiales de estudio
        </p>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subtopics.map((subtopic) => (
            <Card key={subtopic.subtopic_id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div>
                  <CardTitle className="text-xl">{subtopic.subtopic_title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {subtopic.flashcards_count} tarjetas
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <School className="w-4 h-4 mr-1" />
                      {subtopic.quizzes_count} preguntas
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Conceptos Clave:</p>
                    <div className="flex flex-wrap gap-2">
                      {subtopic.key_concepts.map((concept, index) => (
                        <Badge key={index} variant="secondary">
                          {concept}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigateToFlashcards(subtopic.subtopic_id)}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Flashcards
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigateToQuizzes(subtopic.subtopic_id)}
                >
                  <BrainCircuit className="w-4 h-4 mr-2" />
                  Quizzes
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}