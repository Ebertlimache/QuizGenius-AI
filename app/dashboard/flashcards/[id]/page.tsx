"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"

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
  
  const handleKnown = () => {
    const newKnownCards = new Set(knownCards)
    newKnownCards.add(card.id)
    setKnownCards(newKnownCards)
    
    const newReviewCards = new Set(reviewCards)
    newReviewCards.delete(card.id)
    setReviewCards(newReviewCards)
    
    // Actualizar el progreso del usuario
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const userIndex = users.findIndex((u: User) => u.email === currentUser.email)
    
    if (userIndex !== -1) {
      if (!users[userIndex].progress) {
        users[userIndex].progress = {
          quizzes: [],
          flashcards: [],
          uploadedMaterials: []
        }
      }
      
      if (!users[userIndex].progress.flashcards) {
        users[userIndex].progress.flashcards = []
      }
      
      const flashcardSet = users[userIndex].progress.flashcards.find(
        (set: any) => set.setId === flashcardSet.id
      )
      
      if (flashcardSet) {
        flashcardSet.knownCards = newKnownCards.size
        flashcardSet.lastStudied = new Date().toISOString()
      } else {
        users[userIndex].progress.flashcards.push({
          setId: flashcardSet.id,
          knownCards: newKnownCards.size,
          totalCards: flashcardSet.cards.length,
          lastStudied: new Date().toISOString()
        })
      }
      
      localStorage.setItem('users', JSON.stringify(users))
    }
    
    handleNext()
  }
  
  const handleReview = () => {
    const newReviewCards = new Set(reviewCards)
    newReviewCards.add(card.id)
    setReviewCards(newReviewCards)
    
    const newKnownCards = new Set(knownCards)
    newKnownCards.delete(card.id)
    setKnownCards(newKnownCards)
    
    handleNext()
  }
  
  if (completed) {
    const knownCount = knownCards.size
    const reviewCount = reviewCards.size
    const totalCards = flashcardSet.cards.length
    const knownPercentage = Math.round((knownCount / totalCards) * 100)
    
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sesión completada</h1>
          <p className="text-gray-500">{flashcardSet.title}</p>
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
                  className="stroke-purple-500"
                  cx="50"
                  cy="50"
                  r="40"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 -
