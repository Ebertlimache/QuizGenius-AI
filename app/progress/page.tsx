'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PrivateRoute from '@/components/PrivateRoute';

interface QuizResult {
  date: string;
  score: number;
  totalQuestions: number;
}

export default function ProgressPage() {
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [flashcardProgress, setFlashcardProgress] = useState<number>(0);

  useEffect(() => {
    // Simular carga de resultados desde localStorage
    const storedResults = localStorage.getItem('quizResults');
    if (storedResults) {
      setQuizResults([JSON.parse(storedResults)]);
    }

    // Simular progreso de flashcards
    const storedFlashcards = localStorage.getItem('flashcards');
    if (storedFlashcards) {
      const flashcards = JSON.parse(storedFlashcards);
      const knownCards = new Set(JSON.parse(localStorage.getItem('knownCards') || '[]'));
      const progress = (knownCards.size / flashcards.length) * 100;
      setFlashcardProgress(progress);
    }
  }, []);

  const calculateAverageScore = () => {
    if (quizResults.length === 0) return 0;
    const totalScore = quizResults.reduce((acc, result) => acc + result.score, 0);
    return (totalScore / quizResults.length) * 100;
  };

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
              <h2 className="text-lg font-medium text-gray-900 mb-6">Tu Progreso</h2>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Progreso en Cuestionarios */}
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Cuestionarios</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Promedio de aciertos</span>
                        <span className="text-sm font-medium text-gray-700">
                          {calculateAverageScore().toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-indigo-600 h-2.5 rounded-full"
                          style={{ width: `${calculateAverageScore()}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Cuestionarios completados: {quizResults.length}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progreso en Flashcards */}
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Flashcards</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Tarjetas dominadas</span>
                        <span className="text-sm font-medium text-gray-700">
                          {flashcardProgress.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-indigo-600 h-2.5 rounded-full"
                          style={{ width: `${flashcardProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recomendaciones */}
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recomendaciones</h3>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-sm text-indigo-700">
                    {flashcardProgress < 50
                      ? 'Te recomendamos practicar más con las flashcards para mejorar tu retención.'
                      : '¡Buen trabajo! Sigue practicando para mantener tu nivel.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </PrivateRoute>
  );
} 