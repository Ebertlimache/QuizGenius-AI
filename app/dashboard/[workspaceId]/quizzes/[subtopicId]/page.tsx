"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileQuestion, Clock, Plus, Trophy, Target } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

const API_URL = "http://localhost:8000/api/v1";


interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizData {
  id: string;
  title: string;
  description?: string;
  difficulty?: string;
  questions: number;
  completed_at?: string;
  score?: number;
  time_spent?: number;
}
  
export default function QuizzesPage() {
  const params = useParams();
  console.log("Params:", params);
  const subtopicId = params.subtopicId as string;
  const [quizzes, setQuizzes] = useState<QuizData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/workspaces/subtopics/${subtopicId}/quizzes`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch quizzes');
        }

        const data = await response.json();
        setQuizzes(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [subtopicId]);

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "Fácil":
        return "bg-green-100 text-green-800"
      case "Medio":
        return "bg-yellow-100 text-yellow-800"
      case "Difícil":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cuestionarios</h1>
          <p className="text-gray-600">Gestiona y realiza tus cuestionarios generados con IA.</p>
        </div>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {quizzes.map((quiz) => (
            <CarouselItem key={quiz.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
              <Card className="min-h-[450px] flex flex-col">
                <CardHeader className="flex-grow">
                  <div className="flex items-center justify-between">
                    <div className="rounded-full bg-blue-100 p-2">
                      <FileQuestion className="h-4 w-4 text-blue-600" />
                    </div>
                    <Badge className={getDifficultyColor(quiz.difficulty)}>{quiz.difficulty || "Básico"}</Badge>
                  </div>
                  <CardTitle className="mt-4 text-xl">{quiz.title}</CardTitle>
                  <CardDescription className="mt-2 text-base">{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <FileQuestion className="mr-2 h-5 w-5" />
                      {quiz.questions} preguntas
                    </div>
                    {quiz.completed_at && (
                      <>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="mr-2 h-5 w-5" />
                          {quiz.time_spent} minutos
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Trophy className="mr-2 h-5 w-5" />
                          Puntuación: {quiz.score}%
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button className="w-full text-base py-6" asChild>
                    <Link href={`/dashboard/${params.workspaceId}/quizzes/${quiz.id}`}>
                      {quiz.completed_at ? "Volver a intentar" : "Comenzar"}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}
