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

    // Events for Kwala integration
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

        // Track if this is a new user
        if (!hasPlayedQuiz[msg.sender]) {
            hasPlayedQuiz[msg.sender] = true;
            totalUsers++;
        }

        // Check if this is the first attempt for this quiz
        bool isFirstAttempt = !hasUserAttemptedQuiz[msg.sender][_quizId];
        hasUserAttemptedQuiz[msg.sender][_quizId] = true;

        // Get previous best score for this quiz
        uint256 previousBestScore = userBestScores[msg.sender][_quizId];
        bool isNewHighScore = _score > previousBestScore;

        // Update best score if improved
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

        // Store the quiz result
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

        // Emit general quiz completion event
        emit QuizCompleted(
            msg.sender,
            _quizId,
            _score,
            _totalQuestions,
            _badgeLevel,
            block.timestamp,
            isNewHighScore
        );

        // Emit badge earned event (for Kwala to catch and mint badge)
        emit BadgeEarned(
            msg.sender,
            _quizId,
            _score,
            _badgeLevel,
            isNewHighScore,
            isFirstAttempt,
            block.timestamp
        );

        // Special event for Kwala integration - triggers badge minting flow
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

        // Special event for perfect scores
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