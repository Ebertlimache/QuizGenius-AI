"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, RotateCcw, Brain } from "lucide-react"
import { useParams, useRouter,  } from "next/navigation"
import { useTheme } from "next-themes"

type Flashcard = {
  id: number;
  front: string;
  back: string;
}

type FlashcardSet = {
  id: string;
  title: string;
  cards: Flashcard[];
}

const API_URL = "http://localhost:8000/api/v1";

export default function FlashcardPage() {
  const params = useParams()
  console.log("Params:", params);
  
  const subtopicId = params.subtopicId as string
  if (!subtopicId) {
    return <div>Error: Subtopic ID is required</div>
  }

  const [currentCard, setCurrentCard] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [knownCards, setKnownCards] = useState<Set<number>>(new Set())
  const [reviewCards, setReviewCards] = useState<Set<number>>(new Set())
  const [completed, setCompleted] = useState(false)
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const { theme } = useTheme()
  
  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
          return
        }

        const response = await fetch(`${API_URL}/workspaces/subtopics/${subtopicId}/flashcards`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('No se encontraron flashcards para este subtema')
          }
          if (response.status === 403) {
            throw new Error('No tienes permiso para acceder a estas flashcards')
          }
          throw new Error('Error al cargar las flashcards')
        }

        const data = await response.json()
        setFlashcardSet(data)
      } catch (err: any) {
        setError(err.message || 'Error al cargar las flashcards')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFlashcards()
  }, [subtopicId, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error || !flashcardSet) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Brain className="h-12 w-12 text-indigo-600 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Oops!</h2>
        <p className="text-gray-500 mb-4">{error || 'No se pudieron cargar las flashcards'}</p>
        <Button onClick={() => router.back()}>Volver</Button>
      </div>
    )
  }

  const card = flashcardSet.cards[currentCard]
  const progress = ((currentCard + 1) / flashcardSet.cards.length) * 100

  const handleFlip = () => {
    setFlipped(!flipped)
  }

  const handleNext = () => {
    if (currentCard < flashcardSet.cards.length - 1) {
      setCurrentCard(currentCard + 1)
      setFlipped(false)
    } else {
      setCompleted(true)
    }
  }

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1)
      setFlipped(false)
    }
  }

  const handleReview = () => {
    const newReviewCards = new Set(reviewCards)
    newReviewCards.add(card.id)
    setReviewCards(newReviewCards)
    const newKnownCards = new Set(knownCards)
    newKnownCards.delete(card.id)
    setKnownCards(newKnownCards)
    setFlipped(false)
  }

  if (completed) {
    const knownCount = knownCards.size
    const reviewCount = reviewCards.size
    const totalCards = flashcardSet.cards.length
    const knownPercentage = Math.round((knownCount / totalCards) * 100)

    return (
      <div className={theme === 'dark' ? 'min-h-screen bg-gray-900 flex flex-col' : 'min-h-screen bg-gray-50 flex flex-col'}>
        <div className="flex-1 max-w-2xl mx-auto w-full space-y-6 p-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Brain className="h-12 w-12 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Sesión completada</h1>
            <p className="text-gray-500 mt-2">{flashcardSet.title}</p>
          </div>

          <Card className="p-6">
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative h-32 w-32">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{knownPercentage}%</span>
                </div>
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle
                    className="stroke-gray-200"
                    cx="50"
                    cy="50"
                    r="40"
                    strokeWidth="10"
                    fill="none"
                  />
                  <circle
                    className="stroke-indigo-500"
                    cx="50"
                    cy="50"
                    r="40"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * knownPercentage) / 100}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
              <div className="mt-6 text-center">
                <p className="text-lg font-medium">
                  {knownCount} de {totalCards} tarjetas aprendidas
                </p>
                <p className="text-sm text-gray-500">
                  {reviewCount} tarjetas para repasar
                </p>
              </div>
            </div>
          </Card>

          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
            <Button
              onClick={() => {
                setCurrentCard(0)
                setFlipped(false)
                setCompleted(false)
              }}
              className="w-full sm:w-auto"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Repetir sesión
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={theme === 'dark' ? 'min-h-screen bg-gray-900 flex flex-col' : 'min-h-screen bg-gray-50 flex flex-col'}>
      <div className="flex-1 max-w-2xl mx-auto w-full space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{flashcardSet.title}</h1>
            <p className="text-sm text-gray-500">
              Tarjeta {currentCard + 1} de {flashcardSet.cards.length}
            </p>
          </div>
          <div className="w-32 h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-black rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <Card
          className={`relative h-64 cursor-pointer transition-all duration-500 transform hover:shadow-lg ${
            flipped ? "rotate-y-180" : ""
          } ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}
          onClick={handleFlip}
        >
          <div className={`absolute inset-0 p-6 flex items-center justify-center text-center ${
            flipped ? "hidden" : ""
          }`}>
            <p className="text-xl font-medium">{card.front}</p>
          </div>
          <div className={`absolute inset-0 p-6 flex items-center justify-center text-center ${
            flipped ? "" : "hidden"
          }`}>
            <p className="text-xl">{card.back}</p>
          </div>
        </Card>

        <div className="flex justify-between items-center gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentCard === 0}
            className="flex-1 h-12 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Anterior
          </Button>
          <Button
            onClick={handleReview}
            className="flex-1 h-12 bg-black hover:bg-gray-900 text-white border-2 border-black hover:border-gray-900 transition-colors"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Repasar
          </Button>

          <Button
            variant="outline"
            onClick={handleNext}
            disabled={currentCard === flashcardSet.cards.length - 1}
            className="flex-1 h-12 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 transition-colors"
          >
            Siguiente
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}