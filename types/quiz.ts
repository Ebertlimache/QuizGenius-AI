export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

export interface QuizData {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  questions: QuizQuestion[];
  completed_at?: string;
  score?: number;
  time_spent?: number;
}

export interface QuizResult {
  quizId: number;
  score: number;
  completedAt: string;
  answers: (number | null)[];
  timeSpent: number;
}