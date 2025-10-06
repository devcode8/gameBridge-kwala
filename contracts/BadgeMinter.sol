// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

interface IQuizProgress {
    function markBadgeAsMinted(address _user, uint256 _resultIndex) external;
}

contract BadgeMinter is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    struct Badge {
        uint256 quizId;
        uint256 score;
        uint256 totalQuestions;
        string badgeLevel;
        uint256 timestamp;
        bool isHighScore;
        bool isFirstAttempt;
    }
    
    mapping(uint256 => Badge) public badges; // tokenId => Badge
    mapping(address => uint256[]) public userBadges; // user => tokenIds
    mapping(address => mapping(uint256 => uint256[])) public quizBadges; // user => quizId => tokenIds
    
    address public quizProgressContract;
    address public kwalaOperator; // Kwala backend address
    
    // Badge metadata URIs for different levels
    mapping(string => string) public badgeURIs;
    
    modifier onlyKwalaOperator() {
        require(msg.sender == kwalaOperator || msg.sender == owner(), "Only Kwala operator can call this");
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
    
    event KwalaBadgeProcessed(
        address indexed user,
        uint256 indexed quizId,
        uint256 indexed tokenId,
        string badgeLevel,
        uint256 timestamp
    );

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) Ownable(msg.sender) {
        // Initialize default badge URIs
        badgeURIs["Perfect Score"] = "https://api.example.com/metadata/perfect-score.json";
        badgeURIs["Excellent"] = "https://api.example.com/metadata/excellent.json";
        badgeURIs["Great"] = "https://api.example.com/metadata/great.json";
        badgeURIs["Good"] = "https://api.example.com/metadata/good.json";
        badgeURIs["Above Average"] = "https://api.example.com/metadata/above-average.json";
        badgeURIs["Average"] = "https://api.example.com/metadata/average.json";
        badgeURIs["Fair"] = "https://api.example.com/metadata/fair.json";
        badgeURIs["Below Average"] = "https://api.example.com/metadata/below-average.json";
        badgeURIs["Poor"] = "https://api.example.com/metadata/poor.json";
        badgeURIs["Basic"] = "https://api.example.com/metadata/basic.json";
    }
    
    function setQuizProgressContract(address _quizProgress) external onlyOwner {
        quizProgressContract = _quizProgress;
    }
    
    function setKwalaOperator(address _kwalaOperator) external onlyOwner {
        kwalaOperator = _kwalaOperator;
    }
    
    function setBadgeURI(string memory _badgeLevel, string memory _uri) external onlyOwner {
        badgeURIs[_badgeLevel] = _uri;
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
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        // Create badge struct
        Badge memory newBadge = Badge({
            quizId: quizId,
            score: score,
            totalQuestions: totalQuestions,
            badgeLevel: badgeLevel,
            timestamp: block.timestamp,
            isHighScore: isHighScore,
            isFirstAttempt: isFirstAttempt
        });
        
        badges[tokenId] = newBadge;
        userBadges[to].push(tokenId);
        quizBadges[to][quizId].push(tokenId);
        
        // Mint the NFT
        _safeMint(to, tokenId);
        
        // Set token URI based on badge level
        string memory tokenURI = badgeURIs[badgeLevel];
        if (bytes(tokenURI).length > 0) {
            _setTokenURI(tokenId, tokenURI);
        }
        
        emit BadgeMinted(
            to,
            tokenId,
            quizId,
            score,
            badgeLevel,
            isHighScore,
            isFirstAttempt
        );
        
        emit KwalaBadgeProcessed(
            to,
            quizId,
            tokenId,
            badgeLevel,
            block.timestamp
        );
    }
    
    function mintBadgeWithCustomURI(
        address to,
        uint256 quizId,
        uint256 score,
        uint256 totalQuestions,
        string memory badgeLevel,
        string memory customURI,
        bool isHighScore,
        bool isFirstAttempt
    ) external onlyKwalaOperator {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        Badge memory newBadge = Badge({
            quizId: quizId,
            score: score,
            totalQuestions: totalQuestions,
            badgeLevel: badgeLevel,
            timestamp: block.timestamp,
            isHighScore: isHighScore,
            isFirstAttempt: isFirstAttempt
        });
        
        badges[tokenId] = newBadge;
        userBadges[to].push(tokenId);
        quizBadges[to][quizId].push(tokenId);
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, customURI);
        
        emit BadgeMinted(
            to,
            tokenId,
            quizId,
            score,
            badgeLevel,
            isHighScore,
            isFirstAttempt
        );
        
        emit KwalaBadgeProcessed(
            to,
            quizId,
            tokenId,
            badgeLevel,
            block.timestamp
        );
    }
    
    function getUserBadges(address user) external view returns (uint256[] memory) {
        return userBadges[user];
    }
    
    function getUserQuizBadges(address user, uint256 quizId) external view returns (uint256[] memory) {
        return quizBadges[user][quizId];
    }
    
    function getBadgeInfo(uint256 tokenId) external view returns (Badge memory) {
        require(_exists(tokenId), "Badge does not exist");
        return badges[tokenId];
    }
    
    function getTotalBadgesMinted() external view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    function getUserBadgeCount(address user) external view returns (uint256) {
        return userBadges[user].length;
    }
    
    // Function to burn badge (if needed for special cases)
    function burnBadge(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender || msg.sender == owner(), "Not authorized to burn this badge");
        
        address owner = ownerOf(tokenId);
        Badge memory badge = badges[tokenId];
        
        // Remove from user's badge list
        uint256[] storage userTokens = userBadges[owner];
        for (uint256 i = 0; i < userTokens.length; i++) {
            if (userTokens[i] == tokenId) {
                userTokens[i] = userTokens[userTokens.length - 1];
                userTokens.pop();
                break;
            }
        }
        
        // Remove from quiz-specific badge list
        uint256[] storage quizTokens = quizBadges[owner][badge.quizId];
        for (uint256 i = 0; i < quizTokens.length; i++) {
            if (quizTokens[i] == tokenId) {
                quizTokens[i] = quizTokens[quizTokens.length - 1];
                quizTokens.pop();
                break;
            }
        }
        
        delete badges[tokenId];
        _burn(tokenId);
    }
    
    // Override required functions
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}