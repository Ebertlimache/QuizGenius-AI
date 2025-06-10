export interface User {
  id: number;
  email: string;
  progress: {
    quizzes: {
      quizId: string;
      score: number;
      completedAt: string;
    }[];
    flashcards: {
      setId: string;
      knownCards: number;
      totalCards: number;
      lastStudied: string;
    }[];
    uploadedMaterials: {
      id: string;
      title: string;
      uploadedAt: string;
      status: 'pending' | 'approved' | 'rejected';
      feedback?: string;
    }[];
  };
}

export interface UserOld {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'docente' | 'estudiante';
  assignedTo: string; 
  progress: {
    quizzes: {
      quizId: string;
      score: number;
      completedAt: string;
    }[];
    flashcards: {
      setId: string;
      knownCards: number;
      totalCards: number;
      lastStudied: string;
    }[];
    uploadedMaterials: {
      id: string;
      title: string;
      uploadedAt: string;
      status: 'pending' | 'approved' | 'rejected';
      feedback?: string;
    }[];
  };
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  createdAt: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
}

export interface Progress {
  userId: string;
  quizResults: {
    quizId: string;
    score: number;
    completedAt: string;
  }[];
  flashcardProgress: {
    cardId: string;
    known: boolean;
    lastReviewed: string;
  }[];
}

export interface RegisterData {
  name: string; 
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
} 
