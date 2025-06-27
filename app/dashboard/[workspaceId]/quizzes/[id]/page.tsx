"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Clock, Flag } from "lucide-react"

// Datos simulados del cuestionario
const quizData = {
  id: "1",
  title: "Biología Celular",
  description: "Conceptos fundamentales de la célula y sus orgánulos",
  difficulty: "Intermedio",
  questions: [
    {
      id: 1,
      question: "¿Cuál es la función principal de la mitocondria?",
      options: [
        "Producción de energía (ATP)",
        "Síntesis de proteínas",
        "Digestión celular",
        "Almacenamiento de lípidos",
      ],
      correctAnswer: 0,
      explanation:
        "Las mitocondrias son conocidas como las 'centrales energéticas' de la célula porque producen ATP a través de la respiración celular.",
    },
    {
      id: 2,
      question: "¿Qué orgánulo celular contiene ADN además del núcleo?",
      options: ["Ribosoma", "Aparato de Golgi", "Mitocondria", "Lisosoma"],
      correctAnswer: 2,
      explanation:
        "Las mitocondrias tienen su propio ADN circular, similar al de las bacterias, lo que apoya la teoría endosimbiótica.",
    },
    {
      id: 3,
      question: "¿Cuál es la principal diferencia entre células procariotas y eucariotas?",
      options: [
        "Tamaño celular",
        "Presencia de membrana celular",
        "Presencia de núcleo definido",
        "Capacidad de reproducción",
      ],
      correctAnswer: 2,
      explanation:
        "Las células eucariotas tienen un núcleo definido rodeado por una membrana nuclear, mientras que las procariotas no.",
    },
    {
      id: 4,
      question: "¿Dónde se realiza la fotosíntesis en las células vegetales?",
      options: ["Mitocondria", "Núcleo", "Cloroplasto", "Vacuola"],
      correctAnswer: 2,
      explanation: "Los cloroplastos contienen clorofila y son los orgánulos donde se lleva a cabo la fotosíntesis.",
    },
    {
      id: 5,
      question: "¿Qué estructura controla el paso de sustancias hacia dentro y fuera de la célula?",
      options: ["Pared celular", "Membrana plasmática", "Citoplasma", "Núcleo"],
      correctAnswer: 1,
      explanation:
        "La membrana plasmática es selectivamente permeable y regula el intercambio de sustancias con el ambiente.",
    },
  ],
}

export default function QuizPage({ params }: { params: { id: string } }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>(Array(quizData.questions.length).fill(null))
  const [showFeedback, setShowFeedback] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const router = useRouter()

  const question = quizData.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100

  // Simular timer
  useState(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  })

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleOptionSelect = (optionIndex: number) => {
    if (showFeedback) return
    setSelectedOption(optionIndex)
  }

  const handleNext = () => {
    // Guardar respuesta actual
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = selectedOption
    setAnswers(newAnswers)

    if (showFeedback) {
      // Si estamos mostrando feedback, avanzamos a la siguiente pregunta
      setShowFeedback(false)

      if (currentQuestion < quizData.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedOption(answers[currentQuestion + 1])
      } else {
        // Quiz completado
        handleQuizComplete()
      }
    } else {
      // Si no estamos mostrando feedback, lo mostramos
      setShowFeedback(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedOption(answers[currentQuestion - 1])
      setShowFeedback(false)
    }
  }

  const calculateScore = () => {
    const correctAnswers = answers.filter((answer, index) => answer === quizData.questions[index].correctAnswer).length
    return Math.round((correctAnswers / quizData.questions.length) * 100)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Básico":
        return "bg-green-100 text-green-800"
      case "Intermedio":
        return "bg-yellow-100 text-yellow-800"
      case "Avanzado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleQuizComplete = () => {
    const score = calculateScore();
    const quizResult = {
      quizId: quizData.id,
      score,
      completedAt: new Date().toISOString()
    };

    // Actualizar el progreso del usuario
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: User) => u.email === currentUser.email);
    
    if (userIndex !== -1) {
      if (!users[userIndex].progress) {
        users[userIndex].progress = {
          quizzes: [],
          flashcards: [],
          uploadedMaterials: []
        };
      }
      
      if (!users[userIndex].progress.quizzes) {
        users[userIndex].progress.quizzes = [];
      }
      
      users[userIndex].progress.quizzes.push(quizResult);
      localStorage.setItem('users', JSON.stringify(users));
    }

    setQuizCompleted(true);
  };

  if (quizCompleted) {
    const score = calculateScore()
    const correctAnswers = answers.filter((answer, index) => answer === quizData.questions[index].correctAnswer).length

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
                <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle className="stroke-gray-200" cx="50" cy="50" r="40" strokeWidth="8" fill="none" />
                  <circle
                    className={`stroke-current transition-all duration-1000 ${
                      score >= 80 ? "text-green-500" : score >= 60 ? "text-yellow-500" : "text-red-500"
                    }`}
                    cx="50"
                    cy="50"
                    r="40"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * score) / 100}
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-bold mb-2">
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

          <CardContent className="space-y-4">
            <h3 className="font-semibold text-lg">Revisión de respuestas</h3>
            {quizData.questions.map((q, index) => (
              <div key={q.id} className="rounded-lg border p-4">
                <div className="flex items-start gap-3">
                  {answers[index] === q.correctAnswer ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium mb-2">{q.question}</p>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Tu respuesta:</span>{" "}
                        <span className={answers[index] === q.correctAnswer ? "text-green-600" : "text-red-600"}>
                          {answers[index] !== null ? q.options[answers[index]] : "Sin respuesta"}
                        </span>
                      </p>
                      {answers[index] !== q.correctAnswer && (
                        <p>
                          <span className="font-medium">Respuesta correcta:</span>{" "}
                          <span className="text-green-600">{q.options[q.correctAnswer]}</span>
                        </p>
                      )}
                      <p className="text-gray-600 mt-2">
                        <span className="font-medium">Explicación:</span> {q.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1" asChild>
              <a href="/dashboard/quizzes">Volver a cuestionarios</a>
            </Button>
            <Button className="flex-1" asChild>
              <a href="/dashboard/flashcards/new">Crear flashcards del tema</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
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
        <Button variant="outline" size="sm">
          <Flag className="h-4 w-4 mr-2" />
          Marcar
        </Button>
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
            <div
              key={index}
              className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-all ${
                selectedOption === index
                  ? showFeedback
                    ? index === question.correctAnswer
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                    : "border-blue-500 bg-blue-50"
                  : "hover:bg-gray-50 border-gray-200"
              }`}
              onClick={() => handleOptionSelect(index)}
            >
              {showFeedback && selectedOption === index ? (
                index === question.correctAnswer ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500 mt-0.5 flex-shrink-0" />
                )
              ) : (
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 mt-0.5 flex-shrink-0 ${
                    selectedOption === index ? "border-blue-500 bg-blue-500" : "border-gray-300"
                  }`}
                >
                  {selectedOption === index && <div className="h-2 w-2 rounded-full bg-white" />}
                </div>
              )}
              <span className="text-sm leading-relaxed">{option}</span>
            </div>
          ))}

          {showFeedback && (
            <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-blue-100 p-1">
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
  )
}
