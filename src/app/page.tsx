"use client";

import { useState, useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";
import WalletConnection from "@/components/WalletConnection";
import QuizList from "@/components/QuizList";
import QuizGame from "@/components/QuizGame";
import Badge from "@/components/Badge";
import { sampleQuizzes } from "@/data/quizzes";
import { Quiz, QuizResult } from "@/types/quiz";
import { getQuizResults, clearQuizResults } from "@/utils/database";

export default function Home() {
  const account = useActiveAccount();
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);

  useEffect(() => {
    const loadQuizResults = async () => {
      if (account?.address) {
        try {
          const savedResults = await getQuizResults(account.address);
          setQuizResults(savedResults);
        } catch (error) {
          console.error('Error loading quiz results:', error);
          setQuizResults([]);
        }
      } else {
        setQuizResults([]);
      }
    };
    
    loadQuizResults();
  }, [account?.address]);

  const handleQuizComplete = async () => {
    if (account?.address) {
      try {
        const updatedResults = await getQuizResults(account.address);
        setQuizResults(updatedResults);
      } catch (error) {
        console.error('Error updating quiz results:', error);
      }
    }
  };

  const handleBackToQuizzes = () => {
    setSelectedQuiz(null);
  };

  const handleClearResults = async () => {
    if (account?.address) {
      try {
        await clearQuizResults(account.address);
        setQuizResults([]);
      } catch (error) {
        console.error('Error clearing quiz results:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            🧠 Web3 Quiz Game
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Connect your wallet and test your blockchain knowledge!
          </p>
        </header>

        <div className="max-w-6xl mx-auto">
          {!account?.address ? (
            <div className="flex justify-center">
              <WalletConnection />
            </div>
          ) : selectedQuiz ? (
            <QuizGame
              quiz={selectedQuiz}
              playerAddress={account.address}
              onQuizComplete={handleQuizComplete}
              onBackToQuizzes={handleBackToQuizzes}
            />
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Available Quizzes
                </h2>
                <WalletConnection />
              </div>
              
              <QuizList
                quizzes={sampleQuizzes}
                playerAddress={account.address}
                onSelectQuiz={setSelectedQuiz}
              />

              {quizResults.length > 0 && (
                <div className="mt-12">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                      Your Quiz History & Badges
                    </h3>
                    <button
                      onClick={handleClearResults}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
                    >
                      Clear History
                    </button>
                  </div>
                  
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {quizResults.map((result, index) => {
                      const quiz = sampleQuizzes.find(q => q.id === result.quizId);
                      return (
                        <div
                          key={index}
                          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="font-semibold text-gray-800 dark:text-white">
                                {quiz?.title || `Quiz ${result.quizId}`}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {result.completedAt.toLocaleDateString()}
                              </p>
                            </div>
                            <Badge
                              score={result.score}
                              level={result.badge.level}
                              color={result.badge.color}
                              path={result.badge.path}
                              size={60}
                              showLabel={false}
                            />
                          </div>
                          
                          <div className="text-center">
                            <p className="text-lg font-bold text-gray-800 dark:text-white">
                              {result.score}/{result.totalPossible}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {result.percentage}% • {result.badge.level}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                    <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                      Badge Collection
                    </h4>
                    <div className="flex flex-wrap gap-4 justify-center">
                      {Array.from(new Set(quizResults.map(r => r.score)))
                        .sort((a, b) => b - a)
                        .map(score => {
                          const result = quizResults.find(r => r.score === score);
                          return result ? (
                            <Badge
                              key={score}
                              score={result.score}
                              level={result.badge.level}
                              color={result.badge.color}
                              path={result.badge.path}
                              size={80}
                              showLabel={true}
                            />
                          ) : null;
                        })
                      }
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
