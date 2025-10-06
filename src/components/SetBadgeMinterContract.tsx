import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { quizProgressContract } from "../utils/contract";

interface SetBadgeMinterContractProps {
  badgeMinterAddress: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export default function SetBadgeMinterContract({ 
  badgeMinterAddress, 
  onSuccess, 
  onError 
}: SetBadgeMinterContractProps) {
  const { mutate: sendTransaction, isPending } = useSendTransaction();

  const onClick = () => {
    try {
      const transaction = prepareContractCall({
        contract: quizProgressContract,
        method: "function setBadgeMinterContract(address _badgeMinter)",
        params: [badgeMinterAddress],
      });
      
      sendTransaction(transaction, {
        onSuccess: () => {
          console.log("Badge minter contract set successfully");
          onSuccess?.();
        },
        onError: (error) => {
          console.error("Error setting badge minter contract:", error);
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
      className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
    >
      {isPending ? "Setting..." : "Set Badge Minter Contract"}
    </button>
  );
}