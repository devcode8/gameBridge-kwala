export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  questions: QuizQuestion[];
  totalPoints: number;
}

export interface QuizResult {
  quizId: number;
  playerAddress: string;
  score: number;
  totalPossible: number;
  percentage: number;
  completedAt: Date;
  badge: {
    level: string;
    color: string;
    path: string;
  };
}

export interface GameState {
  currentQuestionIndex: number;
  score: number;
  answers: number[];
  isCompleted: boolean;
  startTime: Date;
}