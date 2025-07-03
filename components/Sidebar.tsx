'use client';

import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Upload,
  FileQuestion,
  BookOpen,
  BarChart3,
  Settings,
  Users,
  FileCheck,
  GraduationCap,
} from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const studentLinks = [
    { href: '/dashboard', label: 'Aprender', icon: LayoutDashboard, color: 'text-yellow-500' },
    { href: '/dashboard/upload', label: 'Sonidos', icon: Upload, color: 'text-pink-500' },
    { href: '/dashboard/quizzes', label: 'Practicar', icon: FileQuestion, color: 'text-sky-500' },
    { href: '/dashboard/flashcards', label: 'Ligas', icon: BookOpen, color: 'text-yellow-400' },
    { href: '/dashboard/progress', label: 'Desafíos', icon: BarChart3, color: 'text-amber-500' },
    { href: '/dashboard/settings', label: 'Tienda', icon: Settings, color: 'text-red-500' },
  ];

  const docenteLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-500' },
    { href: '/dashboard/progreso-estudiantes', label: 'Progreso Estudiantes', icon: GraduationCap, color: 'text-green-500' },
    { href: '/dashboard/revision-material', label: 'Revisión Material', icon: FileCheck, color: 'text-orange-500' },
    { href: '/dashboard/settings', label: 'Configuración', icon: Settings, color: 'text-red-500' },
  ];

  const adminLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-500' },
    { href: '/admin', label: 'Usuarios', icon: Users, color: 'text-purple-500' },
    { href: '/dashboard/settings', label: 'Configuración', icon: Settings, color: 'text-red-500' },
  ];

  const links = user?.role === 'admin' 
    ? adminLinks 
    : user?.role === 'docente' 
      ? docenteLinks 
      : studentLinks;

  // Inicial del usuario para el avatar
  const userInitial = user?.name?.[0]?.toUpperCase() || 'E';

  return (
    <div className="flex h-screen w-80 flex-col bg-white border-r shadow-lg py-10 px-4">
      {/* Logo/Nombre */}
      <div className="mb-12 flex items-center justify-center">
        <span className="text-4xl font-extrabold text-blue-600 tracking-tight" style={{ fontFamily: 'Arial Rounded MT Bold, Arial, sans-serif' }}>QuizGenius</span>
      </div>
      {/* Navegación */}
      <nav className="flex-1 flex flex-col gap-4">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-6 px-7 py-6 rounded-3xl text-xl font-extrabold tracking-wider uppercase transition-all mb-2 shadow-sm",
                active
                  ? "bg-blue-50 border-4 border-blue-300 text-blue-700 shadow-lg"
                  : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700",
              )}
              style={{ minHeight: 80 }}
            >
              <span className={cn(
                "flex items-center justify-center rounded-full",
                active ? "bg-blue-100" : "",
                "p-2"
              )}>
                <Icon size={40} className={link.color} />
              </span>
              <span className="ml-1">{link.label}</span>
            </Link>
          );
        })}
      </nav>
      {/* Avatar/Perfil */}
      <div className="mt-auto flex items-center justify-center pt-8">
        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600 border-4 border-blue-200 shadow">
          {userInitial}
        </div>
      </div>
    </div>
  );
} 