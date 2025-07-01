"use client"

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import Image from 'next/image';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (!email || !password) {
        setError('Por favor completa todos los campos');
        return;
      }
      await register(email, password);
      router.push('/choose-topics');
    } catch (err: any) {
      setError(err.message + "jaja" || 'Error al registrar usuario');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-blue-400 overflow-hidden login-bg-custom">
      {/* Fondo decorativo */}
      <Image src="/fondo.png" alt="Fondo" fill priority className="object-cover z-0" style={{opacity:0.25}} />
      {/* Cerebros y libro decorativos (SVGs inline) */}
      <div className="absolute top-8 left-8 z-10 hidden md:block">
        <svg width="80" height="60" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="40" cy="30" rx="38" ry="18" fill="#FF7BAC"/>
          <ellipse cx="30" cy="30" rx="10" ry="16" fill="#fff" fillOpacity="0.5"/>
        </svg>
      </div>
      <div className="absolute bottom-8 right-8 z-10 hidden md:block">
        <svg width="80" height="60" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="40" cy="30" rx="38" ry="18" fill="#FF7BAC"/>
          <ellipse cx="50" cy="30" rx="10" ry="16" fill="#fff" fillOpacity="0.5"/>
        </svg>
      </div>
      <div className="absolute top-8 right-24 z-10 hidden md:block">
        <svg width="70" height="50" viewBox="0 0 70 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="50" height="30" rx="6" fill="#A0E9A3"/>
          <rect x="20" y="15" width="30" height="20" rx="3" fill="#fff" fillOpacity="0.7"/>
        </svg>
      </div>
      {/* Card de registro con logo integrado */}
      <div className="relative flex flex-col items-center w-full max-w-md">
        <Card className="w-full pt-2 pb-2 px-4 md:px-8 rounded-[2.5rem] shadow-lg bg-white flex flex-col items-center z-20">
          <div className="flex justify-center w-full">
            <div className="rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-white mt-9" style={{width:60, height:60}}>
              <Image src="/logo.png" alt="Logo" width={300} height={260} className="object-contain max-w-none" />
            </div>
          </div>
          <CardHeader className="space-y-1 w-full flex flex-col items-center">
            <CardTitle className="text-3xl text-center font-extrabold text-blue-900 mb-2">Crear una cuenta</CardTitle>
            <CardDescription className="text-center text-blue-700 text-base mb-4">
              Únete a QuizGenius AI y comienza tu viaje de aprendizaje
            </CardDescription>
          </CardHeader>
          <CardContent className="w-full">
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              {error && (
                <div className="bg-red-50 text-red-500 text-sm p-3 rounded-md border border-red-200">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-semibold">Nombre completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-12 py-3 text-lg rounded-xl bg-[#E3F0FF] border-none focus:ring-2 focus:ring-blue-300"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-semibold">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 py-3 text-lg rounded-xl bg-[#E3F0FF] border-none focus:ring-2 focus:ring-blue-300"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-semibold">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 py-3 text-lg rounded-xl bg-[#E3F0FF] border-none focus:ring-2 focus:ring-blue-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md text-xl py-3 rounded-2xl mt-2">
                Crear cuenta
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 w-full mt-2">
            <div className="text-base text-center text-blue-700">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-blue-900 hover:text-blue-700 font-semibold">
                Inicia sesión aquí
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
