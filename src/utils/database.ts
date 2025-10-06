import { QuizResult } from '@/types/quiz';
import { getBadgeIPFSUrl, getBadgeLocalUrl } from '@/utils/ipfs';

export const saveQuizResult = async (result: QuizResult): Promise<void> => {
  try {
    const response = await fetch('/api/quiz-results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quizId: result.quizId,
        playerAddress: result.playerAddress,
        score: result.score,
        totalPossible: result.totalPossible,
        percentage: result.percentage,
        completedAt: result.completedAt.toISOString(),
        badge: result.badge
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to save quiz result');
    }
    
    console.log('Quiz result saved to database successfully');
  } catch (error) {
    console.error('Error saving quiz result to database:', error);
    throw error;
  }
};

export const getQuizResults = async (playerAddress?: string): Promise<QuizResult[]> => {
  try {
    if (!playerAddress) return [];
    
    const response = await fetch(`/api/quiz-results?playerAddress=${encodeURIComponent(playerAddress)}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch quiz results');
    }
    
    const results = await response.json();
    
    return results.map((result: {
      quizId: number;
      playerAddress: string;
      score: number;
      totalPossible: number;
      percentage: number;
      completedAt: string;
      badge: { level: string; color: string; path: string };
    }) => ({
      ...result,
      completedAt: new Date(result.completedAt)
    }));
  } catch (error) {
    console.error('Error loading quiz results from database:', error);
    return [];
  }
};

export const clearQuizResults = async (playerAddress: string): Promise<void> => {
  try {
    const response = await fetch(`/api/quiz-results?playerAddress=${encodeURIComponent(playerAddress)}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Failed to clear quiz results');
    }
    
    console.log('Quiz results cleared from database successfully');
  } catch (error) {
    console.error('Error clearing quiz results from database:', error);
    throw error;
  }
};

export const getBestScoreForQuiz = async (quizId: number, playerAddress: string): Promise<number> => {
  try {
    const response = await fetch(`/api/best-score?quizId=${quizId}&playerAddress=${encodeURIComponent(playerAddress)}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch best score');
    }
    
    const data = await response.json();
    return data.bestScore;
  } catch (error) {
    console.error('Error getting best score from database:', error);
    return 0;
  }
};

export const getBadgeForScore = (score: number, useIPFS: boolean = true): { level: string; color: string; path: string } => {
  const getPath = (score: number) => useIPFS ? getBadgeIPFSUrl(score) : getBadgeLocalUrl(score);
  
  if (score >= 10) return { level: "Winner!", color: "#FF1493", path: getPath(10) };
  if (score >= 9) return { level: "Excellent", color: "#9932CC", path: getPath(9) };
  if (score >= 8) return { level: "Great", color: "#FFD700", path: getPath(8) };
  if (score >= 7) return { level: "Good", color: "#32CD32", path: getPath(7) };
  if (score >= 6) return { level: "Above Average", color: "#87CEEB", path: getPath(6) };
  if (score >= 5) return { level: "Average", color: "#C0C0C0", path: getPath(5) };
  if (score >= 4) return { level: "Fair", color: "#DDA0DD", path: getPath(4) };
  if (score >= 3) return { level: "Below Average", color: "#F0E68C", path: getPath(3) };
  if (score >= 2) return { level: "Poor", color: "#CD853F", path: getPath(2) };
  if (score >= 1) return { level: "Basic", color: "#D2691E", path: getPath(1) };
  
  return { level: "No Achievement", color: "#Gray", path: "" };
};

