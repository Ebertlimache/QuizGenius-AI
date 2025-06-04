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
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/upload', label: 'Subir Material', icon: Upload },
    { href: '/dashboard/quizzes', label: 'Quizzes', icon: FileQuestion },
    { href: '/dashboard/flashcards', label: 'Flashcards', icon: BookOpen },
    { href: '/dashboard/progress', label: 'Progreso', icon: BarChart3 },
    { href: '/dashboard/settings', label: 'Configuración', icon: Settings },
  ];

  const docenteLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/progreso-estudiantes', label: 'Progreso Estudiantes', icon: GraduationCap },
    { href: '/dashboard/revision-material', label: 'Revisión Material', icon: FileCheck },
    { href: '/dashboard/settings', label: 'Configuración', icon: Settings },
  ];

  const adminLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin', label: 'Usuarios', icon: Users },
    { href: '/dashboard/settings', label: 'Configuración', icon: Settings },
  ];

  const links = user?.role === 'admin' 
    ? adminLinks 
    : user?.role === 'docente' 
      ? docenteLinks 
      : studentLinks;

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <span className="text-xl">QuizGenius AI</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive(link.href)
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
} 