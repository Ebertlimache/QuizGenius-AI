"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, RotateCcw, Brain } from "lucide-react"
import { useRouter } from "next/navigation"

type User = {
  email: string;
  progress?: {
    quizzes: any[];
    flashcards: any[];
    uploadedMaterials: any[];
  };
}

// Datos de ejemplo
const flashcardSet = {
  id: "1",
  title: "Biología Celular",
  cards: [
    {
      id: 1,
      front: "¿Qué es la mitocondria?",
      back: "Orgánulo celular responsable de la respiración celular y producción de energía en forma de ATP.",
    },
    {
      id: 2,
      front: "¿Qué es el ADN?",
      back: "Ácido desoxirribonucleico, molécula que contiene la información genética de los organismos.",
    },
    {
      id: 3,
      front: "¿Qué es la membrana celular?",
      back: "Barrera semipermeable que separa el interior de la célula del ambiente externo, controlando el paso de sustancias.",
    },
    {
      id: 4,
      front: "¿Qué son los ribosomas?",
      back: "Orgánulos celulares responsables de la síntesis de proteínas a partir de la información del ARN mensajero.",
    },
  ],
}

export default function FlashcardPage({ params }: { params: { id: string } }) {
  const [currentCard, setCurrentCard] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [knownCards, setKnownCards] = useState<Set<number>>(new Set())
  const [reviewCards, setReviewCards] = useState<Set<number>>(new Set())
  const [completed, setCompleted] = useState(false)
  const router = useRouter()
  
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
    
    // Voltear la tarjeta para repasar
    setFlipped(false)
  }
  
  if (completed) {
    const knownCount = knownCards.size
    const reviewCount = reviewCards.size
    const totalCards = flashcardSet.cards.length
    const knownPercentage = Math.round((knownCount / totalCards) * 100)
    
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
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
              onClick={() => router.push('/dashboard/flashcards')}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Flashcards
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
          }`}
          onClick={handleFlip}
        >
          <div className={`absolute inset-0 p-6 flex items-center justify-center text-center ${
            flipped ? "hidden" : ""
          }`}>
            <p className="text-xl font-medium">{card.front}</p>
          </div>
          <div className={`absolute inset-0 p-6 flex items-center justify-center text-center bg-gray-50 ${
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
