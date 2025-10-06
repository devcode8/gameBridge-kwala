"use client";

import { useState } from "react";
import { Quiz, GameState, QuizResult } from "@/types/quiz";
import { saveQuizResult, getBadgeForScore } from "@/utils/database";
import Badge from "@/components/Badge";
import BlockchainSubmission from "@/components/BlockchainSubmission";

interface QuizGameProps {
  quiz: Quiz;
  playerAddress: string;
  onQuizComplete: (result: QuizResult) => void;
  onBackToQuizzes: () => void;
}

export default function QuizGame({ 
  quiz, 
  playerAddress, 
  onQuizComplete, 
  onBackToQuizzes 
}: QuizGameProps) {
  const [gameState, setGameState] = useState<GameState>({
    currentQuestionIndex: 0,
    score: 0,
    answers: [],
    isCompleted: false,
    startTime: new Date()
  });
  
  const [showBlockchainSubmission, setShowBlockchainSubmission] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const currentQuestion = quiz.questions[gameState.currentQuestionIndex];
  const isLastQuestion = gameState.currentQuestionIndex === quiz.questions.length - 1;

  const handleAnswerSelect = (answerIndex: number) => {
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    const newScore = isCorrect ? gameState.score + currentQuestion.points : gameState.score;
    const newAnswers = [...gameState.answers, answerIndex];

    if (isLastQuestion) {
      const badge = getBadgeForScore(newScore);
      const result: QuizResult = {
        quizId: quiz.id,
        playerAddress,
        score: newScore,
        totalPossible: quiz.totalPoints,
        percentage: Math.round((newScore / quiz.totalPoints) * 100),
        completedAt: new Date(),
        badge
      };

      setGameState({
        ...gameState,
        score: newScore,
        answers: newAnswers,
        isCompleted: true
      });

      // Save to database (async)
      saveQuizResult(result).catch(error => {
        console.error('Failed to save quiz result:', error);
      });
      setQuizResult(result);
      onQuizComplete(result);
    } else {
      setGameState({
        ...gameState,
        currentQuestionIndex: gameState.currentQuestionIndex + 1,
        score: newScore,
        answers: newAnswers
      });
    }
  };

  const progressPercentage = ((gameState.currentQuestionIndex + 1) / quiz.questions.length) * 100;

  if (gameState.isCompleted) {
    const badge = getBadgeForScore(gameState.score);
    
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Quiz Completed! 🎉
          </h2>
          
          <div className="mb-6">
            <Badge
              score={gameState.score}
              level={badge.level}
              color={badge.color}
              path={badge.path}
              size={120}
              showLabel={true}
            />
          </div>
          
          <div className="mb-6">
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
              Your Score: {gameState.score} / {quiz.totalPoints}
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              ({Math.round((gameState.score / quiz.totalPoints) * 100)}%)
            </p>
          </div>
          
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Achievement Unlocked!
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              You earned the <span className="font-bold" style={{ color: badge.color }}>{badge.level}</span> badge
            </p>
            {gameState.score === 10 && (
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
                Perfect score! You&apos;re a Web3 expert! ✨
              </p>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowBlockchainSubmission(!showBlockchainSubmission)}
                className="py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
              >
                {showBlockchainSubmission ? "Hide" : "Mint"}
              </button>
              <button
                onClick={onBackToQuizzes}
                className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Back to Quizzes
              </button>
            </div>
            
            {showBlockchainSubmission && quizResult && (
              <BlockchainSubmission
                quizId={quizResult.quizId}
                score={quizResult.score}
                totalQuestions={quizResult.totalPossible}
                badgeLevel={quizResult.badge.level}
                onSuccess={(txHash) => {
                  console.log("Transaction successful:", txHash);
                  alert(`Success! Transaction hash: ${txHash}`);
                }}
                onError={(error) => {
                  console.error("Transaction failed:", error);
                  alert(`Transaction failed: ${error.message}`);
                }}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {quiz.title}
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Question {gameState.currentQuestionIndex + 1} of {quiz.questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
          {currentQuestion.question}
        </h3>
        <div className="grid gap-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className="p-4 text-left bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900 border border-gray-200 dark:border-gray-600 rounded-lg transition-colors"
            >
              <span className="font-medium text-gray-800 dark:text-white">
                {String.fromCharCode(65 + index)}. {option}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Points: {currentQuestion.points}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Current Score: {gameState.score}
        </div>
      </div>
    </div>
  );
}