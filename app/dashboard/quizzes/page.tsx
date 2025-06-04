import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileQuestion, Clock, Plus, Trophy, Target } from "lucide-react"
import Link from "next/link"

// Datos simulados
const quizzes = [
  {
    id: 1,
    title: "Biología Celular",
    description: "Conceptos fundamentales de la célula y sus orgánulos",
    questions: 15,
    completedAt: "2024-01-15",
    score: 85,
    difficulty: "Intermedio",
    timeSpent: "12 min",
  },
  {
    id: 2,
    title: "Química Orgánica",
    description: "Compuestos orgánicos y reacciones químicas",
    questions: 12,
    completedAt: "2024-01-12",
    score: 92,
    difficulty: "Avanzado",
    timeSpent: "18 min",
  },
  {
    id: 3,
    title: "Historia Mundial",
    description: "Eventos importantes del siglo XX",
    questions: 20,
    completedAt: "2024-01-10",
    score: 78,
    difficulty: "Básico",
    timeSpent: "25 min",
  },
  {
    id: 4,
    title: "Matemáticas Cálculo",
    description: "Derivadas e integrales básicas",
    questions: 10,
    completedAt: null,
    score: null,
    difficulty: "Avanzado",
    timeSpent: null,
  },
  {
    id: 5,
    title: "Física Mecánica",
    description: "Leyes de Newton y cinemática",
    questions: 8,
    completedAt: null,
    score: null,
    difficulty: "Intermedio",
    timeSpent: null,
  },
]

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

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-600"
  if (score >= 60) return "text-yellow-600"
  return "text-red-600"
}

export default function QuizzesPage() {
  const completedQuizzes = quizzes.filter((quiz) => quiz.completedAt)
  const pendingQuizzes = quizzes.filter((quiz) => !quiz.completedAt)
  const averageScore = completedQuizzes.reduce((acc, quiz) => acc + (quiz.score || 0), 0) / completedQuizzes.length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cuestionarios</h1>
          <p className="text-gray-600">Gestiona y realiza tus cuestionarios generados con IA.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/upload">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo cuestionario
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileQuestion className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{quizzes.length}</p>
                <p className="text-sm text-gray-600">Total cuestionarios</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{completedQuizzes.length}</p>
                <p className="text-sm text-gray-600">Completados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{Math.round(averageScore)}%</p>
                <p className="text-sm text-gray-600">Promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{pendingQuizzes.length}</p>
                <p className="text-sm text-gray-600">Pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Quizzes */}
      {pendingQuizzes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Cuestionarios pendientes</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pendingQuizzes.map((quiz) => (
              <Card key={quiz.id} className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="rounded-full bg-orange-100 p-2">
                      <FileQuestion className="h-4 w-4 text-orange-600" />
                    </div>
                    <Badge className={getDifficultyColor(quiz.difficulty)}>{quiz.difficulty}</Badge>
                  </div>
                  <CardTitle className="mt-2">{quiz.title}</CardTitle>
                  <CardDescription>{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-gray-600">
                    <FileQuestion className="mr-2 h-4 w-4" />
                    {quiz.questions} preguntas
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href={`/dashboard/quizzes/${quiz.id}`}>Comenzar cuestionario</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Completed Quizzes */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Cuestionarios completados</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {completedQuizzes.map((quiz) => (
            <Card key={quiz.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="rounded-full bg-green-100 p-2">
                    <Trophy className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getDifficultyColor(quiz.difficulty)}>{quiz.difficulty}</Badge>
                    <Badge variant="outline" className={getScoreColor(quiz.score!)}>
                      {quiz.score}%
                    </Badge>
                  </div>
                </div>
                <CardTitle className="mt-2">{quiz.title}</CardTitle>
                <CardDescription>{quiz.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-gray-600">
                    <FileQuestion className="mr-2 h-4 w-4" />
                    {quiz.questions} preguntas
                  </span>
                  <span className="flex items-center text-gray-600">
                    <Clock className="mr-2 h-4 w-4" />
                    {quiz.timeSpent}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span>Completado el {new Date(quiz.completedAt!).toLocaleDateString()}</span>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Puntuación</span>
                    <span className={`font-medium ${getScoreColor(quiz.score!)}`}>{quiz.score}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className={`h-2 rounded-full ${
                        quiz.score! >= 80 ? "bg-green-500" : quiz.score! >= 60 ? "bg-yellow-500" : "bg-red-500"
                      }`}
                      style={{ width: `${quiz.score}%` }}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href={`/dashboard/quizzes/${quiz.id}/results`}>Ver resultados</Link>
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <Link href={`/dashboard/quizzes/${quiz.id}`}>Repetir</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
