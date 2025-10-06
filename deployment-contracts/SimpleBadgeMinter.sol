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
        address badgeOwner;
        string metadataURI;
    }
    
    mapping(uint256 => Badge) public badges;
    mapping(address => uint256[]) public userBadges;
    mapping(address => mapping(uint256 => uint256[])) public quizBadges; // user => quizId => tokenIds
    
    uint256 public nextTokenId = 1;
    address public owner;
    address public kwalaOperator;
    address public quizProgressContract;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyKwalaOperator() {
        require(msg.sender == kwalaOperator || msg.sender == owner, "Only Kwala operator can call this");
        _;
    }
    
    event BadgeMinted(
        address indexed to,
        uint256 indexed tokenId,
        uint256 indexed quizId,
        uint256 score,
        string badgeLevel,
        bool isHighScore,
        bool isFirstAttempt,
        uint256 timestamp
    );
    
    event KwalaBadgeProcessed(
        address indexed user,
        uint256 indexed quizId,
        uint256 indexed tokenId,
        string badgeLevel,
        uint256 timestamp
    );
    
    constructor() {
        owner = msg.sender;
    }
    
    function setKwalaOperator(address _kwalaOperator) external onlyOwner {
        kwalaOperator = _kwalaOperator;
    }
    
    function setQuizProgressContract(address _quizProgress) external onlyOwner {
        quizProgressContract = _quizProgress;
    }
    
    function mintBadge(
        address to,
        uint256 quizId,
        uint256 score,
        uint256 totalQuestions,
        string memory badgeLevel,
        bool isHighScore,
        bool isFirstAttempt
    ) external onlyKwalaOperator returns (uint256) {
        // Generate metadata URI based on badge level
        string memory metadataURI = generateMetadataURI(badgeLevel, score, totalQuestions);
        uint256 tokenId = nextTokenId++;
        
        badges[tokenId] = Badge({
            quizId: quizId,
            score: score,
            totalQuestions: totalQuestions,
            badgeLevel: badgeLevel,
            timestamp: block.timestamp,
            isHighScore: isHighScore,
            isFirstAttempt: isFirstAttempt,
            badgeOwner: to,
            metadataURI: metadataURI
        });
        
        userBadges[to].push(tokenId);
        quizBadges[to][quizId].push(tokenId);
        
        emit BadgeMinted(
            to,
            tokenId,
            quizId,
            score,
            badgeLevel,
            isHighScore,
            isFirstAttempt,
            block.timestamp
        );
        
        emit KwalaBadgeProcessed(
            to,
            quizId,
            tokenId,
            badgeLevel,
            block.timestamp
        );
        
        return tokenId;
    }
    
    // Alternative mintBadge function with custom metadata URI
    function mintBadgeWithCustomURI(
        address to,
        uint256 quizId,
        uint256 score,
        uint256 totalQuestions,
        string memory badgeLevel,
        string memory customURI,
        bool isHighScore,
        bool isFirstAttempt
    ) external onlyKwalaOperator returns (uint256) {
        uint256 tokenId = nextTokenId++;
        
        badges[tokenId] = Badge({
            quizId: quizId,
            score: score,
            totalQuestions: totalQuestions,
            badgeLevel: badgeLevel,
            timestamp: block.timestamp,
            isHighScore: isHighScore,
            isFirstAttempt: isFirstAttempt,
            badgeOwner: to,
            metadataURI: customURI
        });
        
        userBadges[to].push(tokenId);
        quizBadges[to][quizId].push(tokenId);
        
        emit BadgeMinted(
            to,
            tokenId,
            quizId,
            score,
            badgeLevel,
            isHighScore,
            isFirstAttempt,
            block.timestamp
        );
        
        emit KwalaBadgeProcessed(
            to,
            quizId,
            tokenId,
            badgeLevel,
            block.timestamp
        );
        
        return tokenId;
    }
    
    function getUserBadges(address user) external view returns (uint256[] memory) {
        return userBadges[user];
    }
    
    function getUserQuizBadges(address user, uint256 quizId) external view returns (uint256[] memory) {
        return quizBadges[user][quizId];
    }
    
    function getBadgeInfo(uint256 tokenId) external view returns (Badge memory) {
        require(tokenId < nextTokenId && tokenId > 0, "Badge does not exist");
        return badges[tokenId];
    }
    
    function getTotalBadgesMinted() external view returns (uint256) {
        return nextTokenId - 1;
    }
    
    function getUserBadgeCount(address user) external view returns (uint256) {
        return userBadges[user].length;
    }
    
    function getBadgeOwner(uint256 tokenId) external view returns (address) {
        require(tokenId < nextTokenId && tokenId > 0, "Badge does not exist");
        return badges[tokenId].badgeOwner;
    }
    
    function getBadgeMetadataURI(uint256 tokenId) external view returns (string memory) {
        require(tokenId < nextTokenId && tokenId > 0, "Badge does not exist");
        return badges[tokenId].metadataURI;
    }
    
    // Function to update metadata URI (for dynamic badges)
    function updateBadgeMetadata(uint256 tokenId, string memory newURI) external onlyKwalaOperator {
        require(tokenId < nextTokenId && tokenId > 0, "Badge does not exist");
        badges[tokenId].metadataURI = newURI;
    }
    
    // Emergency function to transfer badge ownership (if needed)
    function transferBadge(uint256 tokenId, address newOwner) external {
        require(tokenId < nextTokenId && tokenId > 0, "Badge does not exist");
        require(msg.sender == badges[tokenId].badgeOwner || msg.sender == owner, "Not authorized");
        
        address oldOwner = badges[tokenId].badgeOwner;
        badges[tokenId].badgeOwner = newOwner;
        
        // Remove from old owner's badges
        uint256[] storage oldOwnerBadges = userBadges[oldOwner];
        for (uint256 i = 0; i < oldOwnerBadges.length; i++) {
            if (oldOwnerBadges[i] == tokenId) {
                oldOwnerBadges[i] = oldOwnerBadges[oldOwnerBadges.length - 1];
                oldOwnerBadges.pop();
                break;
            }
        }
        
        // Add to new owner's badges
        userBadges[newOwner].push(tokenId);
        
        // Update quiz-specific mappings
        uint256 quizId = badges[tokenId].quizId;
        uint256[] storage oldQuizBadges = quizBadges[oldOwner][quizId];
        for (uint256 i = 0; i < oldQuizBadges.length; i++) {
            if (oldQuizBadges[i] == tokenId) {
                oldQuizBadges[i] = oldQuizBadges[oldQuizBadges.length - 1];
                oldQuizBadges.pop();
                break;
            }
        }
        quizBadges[newOwner][quizId].push(tokenId);
    }
    
    function generateMetadataURI(string memory badgeLevel, uint256 score, uint256 totalQuestions) internal pure returns (string memory) {
        // Generate metadata URI based on badge level and IPFS CID
        string memory baseURI = "https://ipfs.io/ipfs/bafybeie3zikearfd4cvobe3gxblwlzlctmgag3lpztooi6r44ncissihde/";
        
        if (keccak256(abi.encodePacked(badgeLevel)) == keccak256(abi.encodePacked("Perfect Score"))) {
            return string(abi.encodePacked(baseURI, "1.png"));
        } else if (keccak256(abi.encodePacked(badgeLevel)) == keccak256(abi.encodePacked("Excellent"))) {
            return string(abi.encodePacked(baseURI, "2.png"));
        } else if (keccak256(abi.encodePacked(badgeLevel)) == keccak256(abi.encodePacked("Great"))) {
            return string(abi.encodePacked(baseURI, "3.png"));
        } else if (keccak256(abi.encodePacked(badgeLevel)) == keccak256(abi.encodePacked("Good"))) {
            return string(abi.encodePacked(baseURI, "4.png"));
        } else if (keccak256(abi.encodePacked(badgeLevel)) == keccak256(abi.encodePacked("Above Average"))) {
            return string(abi.encodePacked(baseURI, "5.png"));
        } else if (keccak256(abi.encodePacked(badgeLevel)) == keccak256(abi.encodePacked("Average"))) {
            return string(abi.encodePacked(baseURI, "6.png"));
        } else if (keccak256(abi.encodePacked(badgeLevel)) == keccak256(abi.encodePacked("Fair"))) {
            return string(abi.encodePacked(baseURI, "7.png"));
        } else if (keccak256(abi.encodePacked(badgeLevel)) == keccak256(abi.encodePacked("Below Average"))) {
            return string(abi.encodePacked(baseURI, "8.png"));
        } else if (keccak256(abi.encodePacked(badgeLevel)) == keccak256(abi.encodePacked("Poor"))) {
            return string(abi.encodePacked(baseURI, "9.png"));
        } else {
            return string(abi.encodePacked(baseURI, "10.png")); // Basic or default
        }
    }
}