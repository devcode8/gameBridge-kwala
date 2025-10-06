import { createThirdwebClient } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const client = createThirdwebClient({
  clientId: "7bdc8715b38056aa63f50cdb1ef1503d",
});

// Function to compile Solidity contracts
async function compileContracts() {
  console.log("Compiling contracts...");
  
  // First, install solc compiler
  try {
    await execAsync('npm install -g solc');
  } catch (error) {
    console.log("Solc already installed or using local version");
  }
  
  // Compile QuizProgress contract
  const quizProgressPath = path.join(__dirname, '../contracts/QuizProgress.sol');
  const badgeMinterPath = path.join(__dirname, '../contracts/BadgeMinter.sol');
  
  // Create a simplified version for compilation without OpenZeppelin dependencies
  console.log("Creating compilation-ready contracts...");
  
  return {
    quizProgress: await compileQuizProgress(),
    badgeMinter: await compileBadgeMinter()
  };
}

async function compileQuizProgress() {
  // For QuizProgress, we can compile directly since it doesn't use OpenZeppelin
  const contractSource = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IBadgeMinter {
    function mintBadge(
        address to,
        uint256 quizId,
        uint256 score,
        uint256 totalQuestions,
        string memory badgeLevel,
        string memory tokenURI
    ) external;
}

contract QuizProgress {
    struct QuizResult {
        uint256 quizId;
        uint256 score;
        uint256 totalQuestions;
        uint256 timestamp;
        string badgeLevel;
        bool badgeMinted;
    }

    mapping(address => QuizResult[]) public userQuizResults;
    mapping(address => mapping(uint256 => uint256)) public userBestScores;
    mapping(address => mapping(uint256 => bool)) public hasUserAttemptedQuiz;
    
    uint256 public totalQuizzesTaken;
    uint256 public totalUsers;
    mapping(address => bool) public hasPlayedQuiz;
    
    address public badgeMinterContract;
    address public owner;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    event QuizCompleted(
        address indexed user,
        uint256 indexed quizId,
        uint256 score,
        uint256 totalQuestions,
        string badgeLevel,
        uint256 timestamp,
        bool isHighScore
    );

    event HighScoreAchieved(
        address indexed user,
        uint256 indexed quizId,
        uint256 newScore,
        uint256 previousScore,
        string badgeLevel,
        uint256 timestamp
    );

    event PerfectScoreAchieved(
        address indexed user,
        uint256 indexed quizId,
        uint256 timestamp,
        string specialBadge
    );

    event BadgeEarned(
        address indexed user,
        uint256 indexed quizId,
        uint256 score,
        string badgeLevel,
        bool isNewHighScore,
        bool isFirstAttempt,
        uint256 timestamp
    );

    event KwalaBadgeRequest(
        address indexed user,
        uint256 indexed quizId,
        uint256 score,
        uint256 totalQuestions,
        string badgeLevel,
        bool isHighScore,
        bool isFirstAttempt,
        uint256 timestamp
    );

    function setBadgeMinterContract(address _badgeMinter) external onlyOwner {
        badgeMinterContract = _badgeMinter;
    }

    function submitQuizResult(
        uint256 _quizId,
        uint256 _score,
        uint256 _totalQuestions,
        string memory _badgeLevel
    ) external {
        require(_score <= _totalQuestions, "Score cannot exceed total questions");
        require(_totalQuestions > 0, "Total questions must be greater than 0");

        if (!hasPlayedQuiz[msg.sender]) {
            hasPlayedQuiz[msg.sender] = true;
            totalUsers++;
        }

        bool isFirstAttempt = !hasUserAttemptedQuiz[msg.sender][_quizId];
        hasUserAttemptedQuiz[msg.sender][_quizId] = true;

        uint256 previousBestScore = userBestScores[msg.sender][_quizId];
        bool isNewHighScore = _score > previousBestScore;

        if (isNewHighScore) {
            userBestScores[msg.sender][_quizId] = _score;
            
            emit HighScoreAchieved(
                msg.sender,
                _quizId,
                _score,
                previousBestScore,
                _badgeLevel,
                block.timestamp
            );
        }

        QuizResult memory newResult = QuizResult({
            quizId: _quizId,
            score: _score,
            totalQuestions: _totalQuestions,
            timestamp: block.timestamp,
            badgeLevel: _badgeLevel,
            badgeMinted: false
        });

        userQuizResults[msg.sender].push(newResult);
        totalQuizzesTaken++;

        emit QuizCompleted(
            msg.sender,
            _quizId,
            _score,
            _totalQuestions,
            _badgeLevel,
            block.timestamp,
            isNewHighScore
        );

        emit BadgeEarned(
            msg.sender,
            _quizId,
            _score,
            _badgeLevel,
            isNewHighScore,
            isFirstAttempt,
            block.timestamp
        );

        emit KwalaBadgeRequest(
            msg.sender,
            _quizId,
            _score,
            _totalQuestions,
            _badgeLevel,
            isNewHighScore,
            isFirstAttempt,
            block.timestamp
        );

        if (_score == _totalQuestions) {
            emit PerfectScoreAchieved(
                msg.sender,
                _quizId,
                block.timestamp,
                "Perfect Score Diamond Badge"
            );
        }
    }

    function markBadgeAsMinted(address _user, uint256 _resultIndex) external {
        require(msg.sender == badgeMinterContract || msg.sender == owner, "Only badge minter or owner can mark as minted");
        require(_resultIndex < userQuizResults[_user].length, "Invalid result index");
        
        userQuizResults[_user][_resultIndex].badgeMinted = true;
    }

    function getUserQuizResults(address _user) external view returns (QuizResult[] memory) {
        return userQuizResults[_user];
    }

    function getUserBestScore(address _user, uint256 _quizId) external view returns (uint256) {
        return userBestScores[_user][_quizId];
    }

    function getUserQuizCount(address _user) external view returns (uint256) {
        return userQuizResults[_user].length;
    }

    function getContractStats() external view returns (uint256, uint256) {
        return (totalQuizzesTaken, totalUsers);
    }

    function getBadgeLevelForScore(uint256 _score) public pure returns (string memory) {
        if (_score >= 10) return "Perfect Score";
        if (_score >= 9) return "Excellent";
        if (_score >= 8) return "Great";
        if (_score >= 7) return "Good";
        if (_score >= 6) return "Above Average";
        if (_score >= 5) return "Average";
        if (_score >= 4) return "Fair";
        if (_score >= 3) return "Below Average";
        if (_score >= 2) return "Poor";
        if (_score >= 1) return "Basic";
        return "No Achievement";
    }

    function hasUserPlayedQuiz(address _user, uint256 _quizId) external view returns (bool) {
        return hasUserAttemptedQuiz[_user][_quizId];
    }

    function getLatestQuizResult(address _user) external view returns (QuizResult memory) {
        require(userQuizResults[_user].length > 0, "No quiz results found");
        return userQuizResults[_user][userQuizResults[_user].length - 1];
    }
}
  `;

  return {
    source: contractSource,
    abi: [] // Will be filled after compilation
  };
}

async function compileBadgeMinter() {
  // For BadgeMinter, we'll create a simplified version without OpenZeppelin for now
  const contractSource = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleBadgeMinter {
    struct Badge {
        uint256 quizId;
        uint256 score;
        uint256 totalQuestions;
        string badgeLevel;
        uint256 timestamp;
        bool isHighScore;
        bool isFirstAttempt;
        address owner;
    }
    
    mapping(uint256 => Badge) public badges;
    mapping(address => uint256[]) public userBadges;
    uint256 public nextTokenId = 1;
    
    address public owner;
    address public kwalaOperator;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    modifier onlyKwalaOperator() {
        require(msg.sender == kwalaOperator || msg.sender == owner, "Only Kwala operator");
        _;
    }
    
    event BadgeMinted(
        address indexed to,
        uint256 indexed tokenId,
        uint256 indexed quizId,
        uint256 score,
        string badgeLevel,
        bool isHighScore,
        bool isFirstAttempt
    );
    
    constructor() {
        owner = msg.sender;
    }
    
    function setKwalaOperator(address _kwalaOperator) external onlyOwner {
        kwalaOperator = _kwalaOperator;
    }
    
    function mintBadge(
        address to,
        uint256 quizId,
        uint256 score,
        uint256 totalQuestions,
        string memory badgeLevel,
        bool isHighScore,
        bool isFirstAttempt
    ) external onlyKwalaOperator {
        uint256 tokenId = nextTokenId++;
        
        badges[tokenId] = Badge({
            quizId: quizId,
            score: score,
            totalQuestions: totalQuestions,
            badgeLevel: badgeLevel,
            timestamp: block.timestamp,
            isHighScore: isHighScore,
            isFirstAttempt: isFirstAttempt,
            owner: to
        });
        
        userBadges[to].push(tokenId);
        
        emit BadgeMinted(to, tokenId, quizId, score, badgeLevel, isHighScore, isFirstAttempt);
    }
    
    function getUserBadges(address user) external view returns (uint256[] memory) {
        return userBadges[user];
    }
    
    function getBadgeInfo(uint256 tokenId) external view returns (Badge memory) {
        return badges[tokenId];
    }
}
  `;

  return {
    source: contractSource,
    abi: [] // Will be filled after compilation
  };
}

async function deployQuizProgress() {
  console.log("Deploying QuizProgress contract...");
  
  try {
    // Note: Actual deployment would use deployContract function
    // which is not available in the current thirdweb version
    console.log("Use 'npx thirdweb deploy' for actual deployment");
    
    return { address: "0x...", txHash: "0x..." };
  } catch (error) {
    console.error("Error deploying QuizProgress:", error);
    throw error;
  }
}

async function deployBadgeMinter() {
  console.log("Deploying BadgeMinter contract...");
  
  try {
    // Note: Actual deployment would use deployContract function
    // which is not available in the current thirdweb version
    console.log("Use 'npx thirdweb deploy' for actual deployment");
    
    return { address: "0x...", txHash: "0x..." };
  } catch (error) {
    console.error("Error deploying BadgeMinter:", error);
    throw error;
  }
}

async function main() {
  try {
    console.log("Starting contract deployment process...");
    
    // Note: For actual deployment, you would need to:
    // 1. Compile the contracts using solc or a framework like Hardhat
    // 2. Extract the ABI and bytecode
    // 3. Use those in the deployContract function
    
    console.log("⚠️  Manual deployment required:");
    console.log("1. Use 'npx thirdweb deploy' command for easier deployment");
    console.log("2. Or compile contracts first to get ABI and bytecode");
    console.log("3. Update this script with actual bytecode and ABI");
    
    // For now, let's use the thirdweb CLI approach
    console.log("\nRunning thirdweb deploy...");
    
  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

// Export functions for individual use
export { deployQuizProgress, deployBadgeMinter, compileContracts };

// Run main if this file is executed directly
if (require.main === module) {
  main();
}