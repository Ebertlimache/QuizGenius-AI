"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Clock, Flag } from "lucide-react"

const API_URL = "http://localhost:8000/api/v1";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Según el backend es correctAnswer, no correct_answer
  explanation: string;
}

interface QuizData {
  id: string; // El backend devuelve string
  title: string;
  description: string;
  difficulty: string;
  questions: QuizQuestion[];
}

function QuizPage() {
  const params = useParams();
  const router = useRouter();
  
  const quizId = params.quizzId as string;
  const subtopicId = params.subtopicId as string;
  const workspaceId = params.workspaceId as string;

  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId || !subtopicId || !workspaceId) {
        setError("Parámetros de URL faltantes");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        
        // Endpoint correcto según el backend
        const response = await fetch(`${API_URL}/workspaces/quizzes/${quizId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudo cargar el cuestionario`);
        }

        const data = await response.json();
        console.log('Quiz data:', data); // Debug
        
        if (!data.questions || data.questions.length === 0) {
          throw new Error('El cuestionario no tiene preguntas');
        }
        
        setQuizData(data);
        setAnswers(new Array(data.questions.length).fill(null));
      } catch (err: any) {
        console.error('Error fetching quiz:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, subtopicId, workspaceId]);

  // Timer
  useEffect(() => {
    if (!quizData || quizCompleted) return;
    
    const timer = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, quizData, quizCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil":
        return "bg-green-100 text-green-800";
      case "Medio":
        return "bg-yellow-100 text-yellow-800";
      case "Difícil":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const calculateScore = () => {
    if (!quizData) return 0;
    const correctAnswers = answers.filter((answer, index) => 
      answer === quizData.questions[index].correctAnswer
    ).length;
    return Math.round((correctAnswers / quizData.questions.length) * 100);
  };

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNext = async () => {
    if (selectedOption === null) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedOption;
    setAnswers(newAnswers);

    if (!showFeedback) {
      setShowFeedback(true);
    } else {
      if (currentQuestion < quizData!.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(newAnswers[currentQuestion + 1]);
        setShowFeedback(false);
      } else {
        await handleQuizComplete();
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(answers[currentQuestion - 1]);
      setShowFeedback(false);
    }
  };

  const handleQuizComplete = () => {
    setQuizCompleted(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !quizData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold mb-2">Error</h2>
        <p className="text-gray-500 mb-2">{error || 'No se pudo cargar el quiz'}</p>
        <p className="text-xs text-gray-400 mb-4">
          QuizId: {quizId}, SubtopicId: {subtopicId}, WorkspaceId: {workspaceId}
        </p>
        <Button onClick={() => router.back()}>Volver</Button>
      </div>
    );
  }

  const question = quizData.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;

  if (quizCompleted) {
    const score = calculateScore();
    const correctAnswers = answers.filter((answer, index) => 
      answer === quizData.questions[index].correctAnswer
    ).length;

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">¡Cuestionario completado!</h1>
          <p className="text-gray-600">{quizData.title}</p>
        </div>

        <Card>
          <CardHeader className="text-center pb-2">
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative h-32 w-32 mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold">{score}%</span>
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-2">
                {score >= 80
                  ? "¡Excelente trabajo! 🎉"
                  : score >= 60
                    ? "¡Buen intento! 👍"
                    : "Necesitas repasar más 📚"}
              </h2>

              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">{correctAnswers}</p>
                  <p className="text-sm text-gray-600">Correctas</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">{quizData.questions.length - correctAnswers}</p>
                  <p className="text-sm text-gray-600">Incorrectas</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{formatTime(timeElapsed)}</p>
                  <p className="text-sm text-gray-600">Tiempo total</p>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1" onClick={() => router.back()}>
              Volver a cuestionarios
            </Button>
            <Button 
              className="flex-1" 
              onClick={() => {
                setQuizCompleted(false);
                setCurrentQuestion(0);
                setAnswers(new Array(quizData.questions.length).fill(null));
                setSelectedOption(null);
                setShowFeedback(false);
              }}
            >
              Repetir quiz
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{quizData.title}</h1>
          <div className="flex items-center gap-4 mt-1">
            <Badge className={getDifficultyColor(quizData.difficulty)}>{quizData.difficulty}</Badge>
            <span className="text-sm text-gray-600">
              Pregunta {currentQuestion + 1} de {quizData.questions.length}
            </span>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              {formatTime(timeElapsed)}
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Progreso</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader className="pb-4">
          <h2 className="text-xl font-semibold leading-relaxed">{question.question}</h2>
        </CardHeader>

        <CardContent className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !showFeedback && handleOptionSelect(index)}
              disabled={showFeedback}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                selectedOption === index
                  ? showFeedback
                    ? index === question.correctAnswer
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                    : "border-blue-500 bg-blue-50"
                  : showFeedback && index === question.correctAnswer
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              } ${showFeedback ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                  selectedOption === index
                    ? showFeedback
                      ? index === question.correctAnswer
                        ? "border-green-500 bg-green-500 text-white"
                        : "border-red-500 bg-red-500 text-white"
                      : "border-blue-500 bg-blue-500 text-white"
                    : showFeedback && index === question.correctAnswer
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-gray-300"
                }`}>
                  {showFeedback && selectedOption === index && index !== question.correctAnswer ? (
                    <XCircle className="h-4 w-4" />
                  ) : showFeedback && index === question.correctAnswer ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <span>{String.fromCharCode(65 + index)}</span>
                  )}
                </div>
                <span className="flex-1">{option}</span>
              </div>
            </button>
          ))}

          {showFeedback && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-blue-100 p-1 mt-0.5">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-blue-900 mb-1">Explicación:</p>
                  <p className="text-blue-800 text-sm">{question.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between pt-6">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>

          <Button onClick={handleNext} disabled={selectedOption === null} className="min-w-[120px]">
            {showFeedback
              ? currentQuestion < quizData.questions.length - 1
                ? "Siguiente"
                : "Ver resultados"
              : "Comprobar"}
            {!showFeedback && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default QuizPage;