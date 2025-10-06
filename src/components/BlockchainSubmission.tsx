"use client";

import { useState } from "react";
import { useSendTransaction, useActiveAccount } from "thirdweb/react";
import { submitQuizResultToBlockchain, QUIZ_PROGRESS_CONTRACT_ADDRESS } from "@/utils/contract";

interface BlockchainSubmissionProps {
  quizId: number;
  score: number;
  totalQuestions: number;
  badgeLevel: string;
  onSuccess?: (txHash: string) => void;
  onError?: (error: Error) => void;
}

export default function BlockchainSubmission({
  quizId,
  score,
  totalQuestions,
  badgeLevel,
  onSuccess,
  onError
}: BlockchainSubmissionProps) {
  const account = useActiveAccount();
  const { mutate: sendTransaction, isPending } = useSendTransaction();
  const [txHash, setTxHash] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitToBlockchain = async () => {
    if (!account) {
      onError?.(new Error("Wallet not connected"));
      return;
    }

    // Check if contract is deployed (placeholder addresses)
    if (QUIZ_PROGRESS_CONTRACT_ADDRESS.startsWith("0x123456")) {
      alert("Smart contract not yet deployed. Your quiz result has been saved locally.");
      return;
    }

    try {
      const transaction = await submitQuizResultToBlockchain(
        quizId,
        score,
        totalQuestions,
        badgeLevel
      );

      sendTransaction(transaction, {
        onSuccess: (result) => {
          setTxHash(result.transactionHash);
          setIsSubmitted(true);
          onSuccess?.(result.transactionHash);
        },
        onError: (error) => {
          console.error("Transaction failed:", error);
          onError?.(error as Error);
        }
      });
    } catch (error) {
      console.error("Error preparing transaction:", error);
      onError?.(error as Error);
    }
  };

  if (isSubmitted && txHash) {
    return (
      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
          ✅ Mint
        </h4>
        <p className="text-sm text-green-600 dark:text-green-300 mb-3">
          Your quiz result has been recorded on the blockchain and will trigger badge minting.
        </p>
        <div className="space-y-2">
          <p className="text-xs text-green-600 dark:text-green-400">
            Transaction Hash: <span className="font-mono break-all">{txHash}</span>
          </p>
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs text-blue-600 hover:text-blue-800 underline"
          >
            View on Sepolia Etherscan ↗
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
        🔗 Mint
      </h4>
      <p className="text-sm text-blue-600 dark:text-blue-300 mb-4">
        Submit your quiz result to the blockchain to trigger NFT badge minting via Kwala.
      </p>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Quiz ID:</span>
            <span className="ml-2 font-semibold">{quizId}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Score:</span>
            <span className="ml-2 font-semibold">{score}/{totalQuestions}</span>
          </div>
          <div className="col-span-2">
            <span className="text-gray-600 dark:text-gray-400">Badge Level:</span>
            <span className="ml-2 font-semibold text-blue-600 dark:text-blue-400">{badgeLevel}</span>
          </div>
        </div>

        <button
          onClick={handleSubmitToBlockchain}
          disabled={isPending || !account}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
        >
          {isPending ? "Minting..." : " MINT"}
        </button>

        {!account && (
          <p className="text-xs text-red-600 dark:text-red-400 text-center">
            Please connect your wallet to submit to blockchain
          </p>
        )}
      </div>
    </div>
  );
}