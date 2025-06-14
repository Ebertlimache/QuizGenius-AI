import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Plus } from "lucide-react"
import Link from "next/link"

// Datos de ejemplo
const flashcardSets = [
  {
    id: 1,
    title: "Biología Celular",
    cards: 24,
    lastStudied: "2024-05-28",
    progress: 75,
  },
  {
    id: 2,
    title: "Química Orgánica",
    cards: 18,
    lastStudied: "2024-05-25",
    progress: 60,
  },
  {
    id: 3,
    title: "Historia Mundial",
    cards: 32,
    lastStudied: "2024-05-20",
    progress: 40,
  },
  {
    id: 4,
    title: "Matemáticas",
    cards: 15,
    lastStudied: null,
    progress: 0,
  },
]

export default function FlashcardsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Flashcards</h1>
          <p className="text-gray-500">Gestiona y estudia tus flashcards generadas con IA.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/upload">
            <Plus className="mr-2 h-4 w-4" />
            Nuevas flashcards
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {flashcardSets.map((set) => (
          <Card key={set.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="rounded-full bg-purple-100 p-2">
                  <BookOpen className="h-4 w-4 text-purple-600" />
                </div>
                <div className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                  {set.cards} tarjetas
                </div>
              </div>
              <CardTitle className="mt-2">{set.title}</CardTitle>
              <CardDescription>
                {set.lastStudied
                  ? `Último estudio: ${new Date(set.lastStudied).toLocaleDateString()}`
                  : "No estudiado aún"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mt-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progreso</span>
                  <span className="font-medium">{set.progress}%</span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-purple-500" style={{ width: `${set.progress}%` }} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={set.progress > 0 ? "outline" : "default"} asChild>
                <Link href={`/dashboard/flashcards/${set.id}`}>{set.progress > 0 ? "Continuar" : "Comenzar"}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
