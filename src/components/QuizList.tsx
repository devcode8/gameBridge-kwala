"use client";

import { useState, useEffect } from "react";
import { Quiz } from "@/types/quiz";
import { getBestScoreForQuiz } from "@/utils/database";

interface QuizListProps {
  quizzes: Quiz[];
  playerAddress: string;
  onSelectQuiz: (quiz: Quiz) => void;
}

export default function QuizList({ quizzes, playerAddress, onSelectQuiz }: QuizListProps) {
  const [bestScores, setBestScores] = useState<Record<number, number>>({});

  useEffect(() => {
    const loadBestScores = async () => {
      const scores: Record<number, number> = {};
      for (const quiz of quizzes) {
        try {
          const score = await getBestScoreForQuiz(quiz.id, playerAddress);
          scores[quiz.id] = score;
        } catch (error) {
          console.error(`Error loading best score for quiz ${quiz.id}:`, error);
          scores[quiz.id] = 0;
        }
      }
      setBestScores(scores);
    };

    if (playerAddress) {
      loadBestScores();
    }
  }, [quizzes, playerAddress]);
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((quiz) => {
        const bestScore = bestScores[quiz.id] || 0;
        return (
          <div
            key={quiz.id}
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
              {quiz.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {quiz.description}
            </p>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {quiz.questions.length} questions
              </span>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {quiz.totalPoints} points
              </span>
            </div>
            {bestScore > 0 && (
              <div className="mb-4 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                  Best Score: {bestScore}/{quiz.totalPoints}
                </span>
              </div>
            )}
            <button
              onClick={() => onSelectQuiz(quiz)}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              {bestScore > 0 ? 'Play Again' : 'Start Quiz'}
            </button>
          </div>
        );
      })}
    </div>
  );
}