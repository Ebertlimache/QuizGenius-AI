'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PrivateRoute from '@/components/PrivateRoute';
import { Flashcard } from '@/lib/types';

// Datos mockeados
const mockFlashcards: Flashcard[] = [
  {
    id: '1',
    front: '¿Cuál es la capital de Francia?',
    back: 'París',
    category: 'Geografía',
  },
  {
    id: '2',
    front: '¿Cuál es el elemento químico con símbolo O?',
    back: 'Oxígeno',
    category: 'Química',
  },
  {
    id: '3',
    front: '¿En qué año comenzó la Primera Guerra Mundial?',
    back: '1914',
    category: 'Historia',
  },
];

export default function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      // Cargar flashcards desde localStorage
      const storedCards = localStorage.getItem('flashcards');
      const storedKnownCards = localStorage.getItem('knownCards');
      
      if (storedCards) {
        setFlashcards(JSON.parse(storedCards));
      } else {
        setFlashcards(mockFlashcards);
        localStorage.setItem('flashcards', JSON.stringify(mockFlashcards));
      }

      if (storedKnownCards) {
        setKnownCards(new Set(JSON.parse(storedKnownCards)));
      }
    } catch (error) {
      console.error('Error loading flashcards:', error);
      setFlashcards(mockFlashcards);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleKnown = () => {
    const currentCard = flashcards[currentIndex];
    setKnownCards((prev) => {
      const newSet = new Set(prev);
      newSet.add(currentCard.id);
      localStorage.setItem('knownCards', JSON.stringify([...newSet]));
      return newSet;
    });
    moveToNextCard();
  };

  const handleReview = () => {
    moveToNextCard();
  };

  const moveToNextCard = () => {
    setIsFlipped(false);
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Volver al inicio cuando se llega al final
      setCurrentIndex(0);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const progress = (knownCards.size / flashcards.length) * 100;

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <span className="text-2xl font-bold text-indigo-600">QuizGenius AI</span>
                </div>
              </div>
              <div className="flex items-center">
                <Link
                  href="/dashboard"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Volver al Dashboard
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="text-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">Flashcards</h2>
                <p className="text-sm text-gray-500">
                  Tarjeta {currentIndex + 1} de {flashcards.length}
                </p>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Progreso: {progress.toFixed(1)}%
                  </p>
                </div>
              </div>

              {currentCard && (
                <div className="max-w-2xl mx-auto">
                  <div
                    className="relative h-64 cursor-pointer perspective-1000"
                    onClick={handleFlip}
                  >
                    <div
                      className={`absolute w-full h-full transition-transform duration-500 transform-style-3d ${
                        isFlipped ? 'rotate-y-180' : ''
                      }`}
                    >
                      <div className="absolute w-full h-full backface-hidden bg-white rounded-lg shadow-lg p-6 flex items-center justify-center">
                        <p className="text-xl text-center">{currentCard.front}</p>
                      </div>
                      <div className="absolute w-full h-full backface-hidden bg-indigo-50 rounded-lg shadow-lg p-6 flex items-center justify-center rotate-y-180">
                        <p className="text-xl text-center">{currentCard.back}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-center space-x-4">
                    <button
                      onClick={handleReview}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Repasar
                    </button>
                    <button
                      onClick={handleKnown}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Lo sabía
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </PrivateRoute>
  );
} 