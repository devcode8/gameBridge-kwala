import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { quizProgressContract } from "../utils/contract";

interface SubmitQuizResultProps {
  quizId: number;
  score: number;
  totalQuestions: number;
  badgeLevel: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export default function SubmitQuizResult({ 
  quizId, 
  score, 
  totalQuestions, 
  badgeLevel, 
  onSuccess, 
  onError 
}: SubmitQuizResultProps) {
  const { mutate: sendTransaction, isPending } = useSendTransaction();

  const onClick = () => {
    try {
      const transaction = prepareContractCall({
        contract: quizProgressContract,
        method: "function submitQuizResult(uint256 _quizId, uint256 _score, uint256 _totalQuestions, string _badgeLevel)",
        params: [BigInt(quizId), BigInt(score), BigInt(totalQuestions), badgeLevel],
      });
      
      sendTransaction(transaction, {
        onSuccess: () => {
          console.log("Quiz result submitted successfully");
          console.log("Events triggered:", {
            QuizCompleted: true,
            BadgeEarned: true,
            KwalaBadgeRequest: true,
            HighScoreAchieved: score > 0, // Will be true if new high score
            PerfectScoreAchieved: score === totalQuestions
          });
          onSuccess?.();
        },
        onError: (error) => {
          console.error("Error submitting quiz result:", error);
          onError?.(error);
        }
      });
    } catch (error) {
      console.error("Error preparing transaction:", error);
      onError?.(error as Error);
    }
  };

  return (
    <button 
      onClick={onClick} 
      disabled={isPending}
      className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
    >
      {isPending ? "Submitting..." : "Submit Quiz Result"}
    </button>
  );
}