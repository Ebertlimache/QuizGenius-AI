"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BookOpen, FileQuestion, CheckCircle2, Brain, ArrowRight } from "lucide-react"

// Datos simulados
const extractedConcepts = [
  {
    id: 1,
    title: "Fotosíntesis",
    description: "Proceso por el cual las plantas convierten la luz solar en energía química mediante la clorofila.",
    difficulty: "Intermedio",
  },
  {
    id: 2,
    title: "Respiración celular",
    description: "Proceso metabólico que convierte nutrientes en ATP, liberando energía para las funciones celulares.",
    difficulty: "Avanzado",
  },
  {
    id: 3,
    title: "Mitocondria",
    description:
      "Orgánulo celular conocido como la 'central energética' de la célula, responsable de la producción de ATP.",
    difficulty: "Básico",
  },
  {
    id: 4,
    title: "Cloroplasto",
    description: "Orgánulo celular donde ocurre la fotosíntesis en las células vegetales, contiene clorofila.",
    difficulty: "Intermedio",
  },
  {
    id: 5,
    title: "ATP (Adenosín trifosfato)",
    description: "Molécula que almacena y transporta energía química en las células de todos los seres vivos.",
    difficulty: "Avanzado",
  },
]

const generatedQuestions = [
  {
    id: 1,
    question: "¿Cuál es la función principal de la fotosíntesis?",
    options: [
      "Liberar oxígeno a la atmósfera",
      "Convertir luz solar en energía química",
      "Absorber dióxido de carbono",
      "Producir clorofila",
    ],
    correctAnswer: 1,
    explanation: "La fotosíntesis convierte la energía lumínica en energía química almacenada en forma de glucosa.",
  },
  {
    id: 2,
    question: "¿Dónde ocurre la fotosíntesis en las células vegetales?",
    options: ["Mitocondria", "Núcleo", "Cloroplasto", "Ribosoma"],
    correctAnswer: 2,
    explanation: "Los cloroplastos contienen clorofila y son el sitio donde se realiza la fotosíntesis.",
  },
  {
    id: 3,
    question: "¿Qué molécula almacena y transporta energía en las células?",
    options: ["ADN", "ARN", "Glucosa", "ATP"],
    correctAnswer: 3,
    explanation: "El ATP es la moneda energética universal de las células.",
  },
  {
    id: 4,
    question: "¿Cuál es el orgánulo conocido como la 'central energética' de la célula?",
    options: ["Cloroplasto", "Mitocondria", "Núcleo", "Retículo endoplasmático"],
    correctAnswer: 1,
    explanation: "Las mitocondrias producen la mayor parte del ATP celular mediante la respiración celular.",
  },
]

export default function PreviewPage() {
  const [selectedTab, setSelectedTab] = useState("concepts")
  const router = useRouter()
  const searchParams = useSearchParams()
  const contentType = searchParams.get("type") || "quiz"

  const handleCreateQuiz = () => {
    router.push("/dashboard/quizzes/new")
  }

  const handleCreateFlashcards = () => {
    router.push("/dashboard/flashcards/new")
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-green-100 p-2">
          <CheckCircle2 className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">¡Análisis completado!</h1>
          <p className="text-gray-600">
            Hemos procesado tu documento "Biología Celular.pdf" y extraído el contenido clave.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-gray-600">Conceptos extraídos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileQuestion className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">4</p>
                <p className="text-sm text-gray-600">Preguntas generadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">10</p>
                <p className="text-sm text-gray-600">Flashcards posibles</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="concepts" onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="concepts">Conceptos clave</TabsTrigger>
          <TabsTrigger value="questions">Preguntas generadas</TabsTrigger>
        </TabsList>

        <TabsContent value="concepts" className="mt-6 space-y-4">
          {extractedConcepts.map((concept) => (
            <Card key={concept.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{concept.title}</CardTitle>
                  <Badge className={getDifficultyColor(concept.difficulty)}>{concept.difficulty}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{concept.description}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="questions" className="mt-6 space-y-6">
          {generatedQuestions.map((question, index) => (
            <Card key={question.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  Pregunta {index + 1}: {question.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className={`flex items-center gap-3 rounded-lg border p-3 ${
                      question.correctAnswer === optionIndex ? "border-green-200 bg-green-50" : "border-gray-200"
                    }`}
                  >
                    {question.correctAnswer === optionIndex ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center">
                        <span className="text-xs font-medium">{optionIndex + 1}</span>
                      </div>
                    )}
                    <span className="text-sm">{option}</span>
                  </div>
                ))}
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Explicación:</strong> {question.explanation}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button onClick={handleCreateQuiz} className="flex-1 gap-2">
          <FileQuestion className="h-5 w-5" />
          Crear cuestionario interactivo
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button onClick={handleCreateFlashcards} variant="outline" className="flex-1 gap-2">
          <BookOpen className="h-5 w-5" />
          Generar flashcards
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
