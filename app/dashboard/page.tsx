'use client';

import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import PrivateRoute from '@/components/PrivateRoute';

export default function DashboardPage() {
  const { user } = useAuth();

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
              <div className="flex items-center space-x-4">
                {user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Panel Admin
                  </Link>
                )}
                <span className="text-gray-700">Hola, {user?.name}</span>
                <Link
                  href="/settings"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Configuración
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                href="/upload"
                className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-medium text-gray-900">Subir Material</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Sube tus materiales de estudio para generar contenido de aprendizaje
                </p>
              </Link>

              <Link
                href="/flashcards"
                className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-medium text-gray-900">Flashcards</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Practica con tarjetas de memoria para mejorar tu retención
                </p>
              </Link>

              <Link
                href="/quiz"
                className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-medium text-gray-900">Cuestionarios</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Pon a prueba tus conocimientos con cuestionarios interactivos
                </p>
              </Link>

              <Link
                href="/progress"
                className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-medium text-gray-900">Progreso</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Visualiza tu progreso y obtén recomendaciones personalizadas
                </p>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </PrivateRoute>
  );
}
