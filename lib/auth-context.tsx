'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize default users if they don't exist
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const defaultUsers = [
      {
        id: 'admin-1',
        name: 'Administrador',
        email: 'admin@admin.com',
        password: 'admin',
        role: 'admin' as const
      },
      {
        id: 'docente-1',
        name: 'Docente',
        email: 'docente@docente.com',
        password: 'docente',
        role: 'docente' as const
      }
    ];

    let hasChanges = false;
    defaultUsers.forEach(defaultUser => {
      if (!users.some((u: User) => u.email === defaultUser.email)) {
        users.push(defaultUser);
        hasChanges = true;
      }
    });

    if (hasChanges) {
      localStorage.setItem('users', JSON.stringify(users));
    }

    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Simulate API call
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find((u: User) => u.email === email && u.password === password);
      
      if (foundUser) {
        setUser(foundUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(foundUser));
      } else {
        throw new Error('Credenciales inválidas');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (newUser: Omit<User, 'id'>) => {
    try {
      // Simulate API call
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (users.some((u: User) => u.email === newUser.email)) {
        throw new Error('El email ya está registrado');
      }

      const user: User = {
        ...newUser,
        id: Math.random().toString(36).substr(2, 9),
      };

      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));
      
      setUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 