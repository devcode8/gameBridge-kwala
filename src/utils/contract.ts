import { createThirdwebClient, getContract, prepareContractCall } from "thirdweb";
import { defineChain } from "thirdweb/chains";

// create the client with your clientId, or secretKey if in a server environment
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "7bdc8715b38056aa63f50cdb1ef1503d",
});

// Contract addresses from environment variables (deployed on Sepolia)
export const QUIZ_PROGRESS_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_QUIZ_PROGRESS_CONTRACT_ADDRESS || "0x7A323e9639fD722BaD3e22910A1b0EB3D4130492";
export const BADGE_MINTER_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_BADGE_MINTER_CONTRACT_ADDRESS || "0x0aCc63313E429C6adc8853651DD63570670EFA8c";

// Define Sepolia chain
const sepoliaChain = defineChain(11155111);

// connect to your QuizProgress contract
export const getQuizProgressContract = () => getContract({
  client,
  chain: sepoliaChain,
  address: QUIZ_PROGRESS_CONTRACT_ADDRESS,
});

// connect to your BadgeMinter contract
export const getBadgeMinterContract = () => getContract({
  client,
  chain: sepoliaChain,
  address: BADGE_MINTER_CONTRACT_ADDRESS,
});

// Direct contract instances for easy access
export const quizProgressContract = getContract({
  client,
  chain: sepoliaChain,
  address: QUIZ_PROGRESS_CONTRACT_ADDRESS,
});

export const badgeMinterContract = getContract({
  client,
  chain: sepoliaChain,
  address: BADGE_MINTER_CONTRACT_ADDRESS,
});

// Quiz Progress Contract Functions
export const submitQuizResultToBlockchain = async (
  quizId: number,
  score: number,
  totalQuestions: number,
  badgeLevel: string
) => {
  try {
    const contract = getQuizProgressContract();
    const transaction = prepareContractCall({
      contract,
      method: "function submitQuizResult(uint256 _quizId, uint256 _score, uint256 _totalQuestions, string memory _badgeLevel)",
      params: [BigInt(quizId), BigInt(score), BigInt(totalQuestions), badgeLevel],
    });

    return transaction;
  } catch (error) {
    console.error("Error preparing quiz result transaction:", error);
    throw error;
  }
};

export const getUserBestScore = async (userAddress: string, quizId: number) => {
  try {
    if (!QUIZ_PROGRESS_CONTRACT_ADDRESS) {
      console.log("QuizProgress contract not deployed yet - deploy to Sepolia first");
      return 0;
    }
    
    // TODO: Implement after deployment
    console.log("getUserBestScore called for:", userAddress, quizId);
    return 0;
    
    // const contract = getQuizProgressContract();
    // const result = await readContract({
    //   contract,
    //   method: "function getUserBestScore(address _user, uint256 _quizId) view returns (uint256)",
    //   params: [userAddress, BigInt(quizId)]
    // });
    // return Number(result);
  } catch (error) {
    console.error("Error fetching user best score:", error);
    return 0;
  }
};

export const getUserQuizResults = async (userAddress: string) => {
  try {
    // Skip contract calls for placeholder addresses
    if (!QUIZ_PROGRESS_CONTRACT_ADDRESS) {
      console.log("QuizProgress contract not deployed yet - deploy to Sepolia first");
      return [];
    }
    
    // TODO: Implement after deployment with actual contract address
    console.log("getUserQuizResults called for:", userAddress);
    return [];
    
    // const contract = getQuizProgressContract();
    // const results = await readContract({
    //   contract,
    //   method: "function getUserQuizResults(address _user) view returns (tuple(uint256 quizId, uint256 score, uint256 totalQuestions, uint256 timestamp, string badgeLevel, bool badgeMinted)[])",
    //   params: [userAddress]
    // });
    // return results;
  } catch (error) {
    console.error("Error fetching user quiz results:", error);
    return [];
  }
};

// Badge Minter Contract Functions
export const getUserBadges = async (userAddress: string) => {
  try {
    if (!BADGE_MINTER_CONTRACT_ADDRESS) {
      console.log("BadgeMinter contract not deployed yet - deploy to Sepolia first");
      return [];
    }
    
    // TODO: Implement after deployment
    console.log("getUserBadges called for:", userAddress);
    return [];
  } catch (error) {
    console.error("Error fetching user badges:", error);
    return [];
  }
};

export const getBadgeInfo = async (tokenId: number) => {
  try {
    if (!BADGE_MINTER_CONTRACT_ADDRESS) {
      console.log("BadgeMinter contract not deployed yet - deploy to Sepolia first");
      return null;
    }
    
    // TODO: Implement after deployment
    console.log("getBadgeInfo called for:", tokenId);
    return null;
  } catch (error) {
    console.error("Error fetching badge info:", error);
    return null;
  }
};

export const getUserQuizBadges = async (userAddress: string, quizId: number) => {
  try {
    if (!BADGE_MINTER_CONTRACT_ADDRESS) {
      console.log("BadgeMinter contract not deployed yet - deploy to Sepolia first");
      return [];
    }
    
    // TODO: Implement after deployment
    console.log("getUserQuizBadges called for:", userAddress, quizId);
    return [];
  } catch (error) {
    console.error("Error fetching user quiz badges:", error);
    return [];
  }
};

// Events for Kwala integration
export const CONTRACT_EVENTS = {
  // QuizProgress Events
  QUIZ_COMPLETED: "QuizCompleted",
  HIGH_SCORE_ACHIEVED: "HighScoreAchieved", 
  PERFECT_SCORE_ACHIEVED: "PerfectScoreAchieved",
  BADGE_EARNED: "BadgeEarned",
  KWALA_BADGE_REQUEST: "KwalaBadgeRequest",
  
  // BadgeMinter Events
  BADGE_MINTED: "BadgeMinted",
  KWALA_BADGE_PROCESSED: "KwalaBadgeProcessed"
} as const;

// Kwala Integration Helper Functions
export const listenForBadgeEvents = (callback: (event: {
  user: string;
  quizId: number;
  score: number;
  badgeLevel: string;
  isHighScore: boolean;
  isFirstAttempt: boolean;
}) => void) => {
  // This would listen for KwalaBadgeRequest events and trigger badge minting
  console.log("Setting up event listeners for Kwala badge integration...");
  console.log("Callback function registered:", typeof callback);
  // Implementation would depend on your event listening setup
};

export const triggerKwalaBadgeMinting = async (
  userAddress: string,
  quizId: number,
  score: number,
  totalQuestions: number,
  badgeLevel: string,
  isHighScore: boolean,
  isFirstAttempt: boolean
) => {
  try {
    // This function would be called by Kwala's backend service
    // to mint badges when quiz events are detected
    console.log("Kwala badge minting triggered for:", {
      userAddress,
      quizId,
      score,
      badgeLevel,
      isHighScore,
      isFirstAttempt
    });
    
    // The actual minting would be done by the Kwala operator
    // through the BadgeMinter contract
    
  } catch (error) {
    console.error("Error triggering Kwala badge minting:", error);
    throw error;
  }
};

// Utility functions for interacting with deployed contracts
export const getContractClient = () => client;
export const getSepoliaChain = () => sepoliaChain;

// Example: Read contract data
export const readQuizProgressContract = async (functionName: string, params: any[] = []) => {
  try {
    const contract = getQuizProgressContract();
    // Use thirdweb's readContract function here
    console.log(`Reading ${functionName} from QuizProgress contract`, params);
    return null; // Replace with actual thirdweb read call
  } catch (error) {
    console.error(`Error reading ${functionName}:`, error);
    throw error;
  }
};

// Example: Test contract connection
export const testContractConnection = async () => {
  try {
    console.log("Testing contract connections...");
    console.log("QuizProgress Contract Address:", QUIZ_PROGRESS_CONTRACT_ADDRESS);
    console.log("BadgeMinter Contract Address:", BADGE_MINTER_CONTRACT_ADDRESS);
    console.log("Chain ID:", sepoliaChain.id);
    console.log("Client ID:", process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID?.substring(0, 10) + "...");
    
    return {
      quizProgress: QUIZ_PROGRESS_CONTRACT_ADDRESS,
      badgeMinter: BADGE_MINTER_CONTRACT_ADDRESS,
      chainId: sepoliaChain.id,
      connected: true
    };
  } catch (error) {
    console.error("Contract connection test failed:", error);
    throw error;
  }
};