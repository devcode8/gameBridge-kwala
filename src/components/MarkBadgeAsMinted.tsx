import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { quizProgressContract } from "../utils/contract";

interface MarkBadgeAsMintedProps {
  userAddress: string;
  resultIndex: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export default function MarkBadgeAsMinted({ 
  userAddress, 
  resultIndex, 
  onSuccess, 
  onError 
}: MarkBadgeAsMintedProps) {
  const { mutate: sendTransaction, isPending } = useSendTransaction();

  const onClick = () => {
    try {
      const transaction = prepareContractCall({
        contract: quizProgressContract,
        method: "function markBadgeAsMinted(address _user, uint256 _resultIndex)",
        params: [userAddress, BigInt(resultIndex)],
      });
      
      sendTransaction(transaction, {
        onSuccess: () => {
          console.log("Badge marked as minted successfully");
          onSuccess?.();
        },
        onError: (error) => {
          console.error("Error marking badge as minted:", error);
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
      className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
    >
      {isPending ? "Marking..." : "Mark Badge as Minted"}
    </button>
  );
}