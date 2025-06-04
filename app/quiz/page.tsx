'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PrivateRoute from '@/components/PrivateRoute';
import { Question } from '@/lib/types';

// Datos mockeados
const mockQuestions: Question[] = [
  {
    id: '1',
    question: '¿Cuál es la capital de Francia?',
    options: ['Londres', 'París', 'Berlín', 'Madrid'],
    correctAnswer: 1,
  },
  {
    id: '2',
    question: '¿Cuál es el elemento químico con símbolo O?',
    options: ['Oro', 'Oxígeno', 'Osmio', 'Oganesón'],
    correctAnswer: 1,
  },
  {
    id: '3',
    question: '¿En qué año comenzó la Primera Guerra Mundial?',
    options: ['1914', '1918', '1939', '1945'],
    correctAnswer: 0,
  },
];

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      // Cargar preguntas desde localStorage
      const storedQuestions = localStorage.getItem('questions');
      if (storedQuestions) {
        setQuestions(JSON.parse(storedQuestions));
      } else {
        setQuestions(mockQuestions);
        localStorage.setItem('questions', JSON.stringify(mockQuestions));
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      setQuestions(mockQuestions);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === questions[currentIndex].correctAnswer) {
      setScore(score + 1);
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
    } else {
      setShowResults(true);
      // Guardar resultados en localStorage
      const results = {
        date: new Date().toISOString(),
        score,
        totalQuestions: questions.length,
      };
      
      try {
        const storedResults = localStorage.getItem('quizResults');
        const allResults = storedResults ? JSON.parse(storedResults) : [];
        allResults.push(results);
        localStorage.setItem('quizResults', JSON.stringify(allResults));
      } catch (error) {
        console.error('Error saving quiz results:', error);
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResults(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

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
              {!showResults ? (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-lg font-medium text-gray-900">Cuestionario</h2>
                    <p className="text-sm text-gray-500">
                      Pregunta {currentIndex + 1} de {questions.length}
                    </p>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-indigo-600 h-2.5 rounded-full"
                          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {currentQuestion && (
                    <div className="max-w-2xl mx-auto">
                      <div className="mb-6">
                        <p className="text-xl font-medium text-gray-900">
                          {currentQuestion.question}
                        </p>
                      </div>

                      <div className="space-y-4">
                        {currentQuestion.options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleAnswerSelect(index)}
                            className={`w-full p-4 text-left rounded-lg border ${
                              selectedAnswer === index
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-gray-300 hover:border-indigo-500'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>

                      <div className="mt-6 flex justify-end">
                        <button
                          onClick={handleNext}
                          disabled={selectedAnswer === null}
                          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                        >
                          {currentIndex < questions.length - 1 ? 'Siguiente' : 'Finalizar'}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <h2 className="text-2xl font-medium text-gray-900 mb-4">¡Quiz completado!</h2>
                  <p className="text-lg text-gray-600 mb-6">
                    Tu puntuación: {score} de {questions.length}
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={handleRestart}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Reiniciar quiz
                    </button>
                    <Link
                      href="/dashboard"
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Volver al Dashboard
                    </Link>
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