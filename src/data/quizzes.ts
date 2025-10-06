import { Quiz } from "@/types/quiz";

export const sampleQuizzes: Quiz[] = [
  {
    id: 1,
    title: "Web3 & Blockchain Basics",
    description: "Test your knowledge of blockchain fundamentals and Web3 concepts",
    totalPoints: 10,
    questions: [
      {
        id: 1,
        question: "What does 'Web3' primarily refer to?",
        options: [
          "The third version of the World Wide Web",
          "A decentralized web built on blockchain technology",
          "A new programming language",
          "A type of database"
        ],
        correctAnswer: 1,
        points: 1
      },
      {
        id: 2,
        question: "What is a smart contract?",
        options: [
          "A legal document stored digitally",
          "A self-executing contract with terms directly written into code",
          "A contract signed electronically",
          "A type of cryptocurrency"
        ],
        correctAnswer: 1,
        points: 1
      },
      {
        id: 3,
        question: "Which consensus mechanism is used by Ethereum 2.0?",
        options: [
          "Proof of Work",
          "Proof of Stake",
          "Proof of Authority",
          "Delegated Proof of Stake"
        ],
        correctAnswer: 1,
        points: 1
      },
      {
        id: 4,
        question: "What is the purpose of gas in Ethereum?",
        options: [
          "To fuel cars",
          "To pay for transaction fees and computational costs",
          "To store data",
          "To mine blocks"
        ],
        correctAnswer: 1,
        points: 1
      },
      {
        id: 5,
        question: "What does NFT stand for?",
        options: [
          "New Financial Technology",
          "Non-Fungible Token",
          "Network File Transfer",
          "Next Future Tech"
        ],
        correctAnswer: 1,
        points: 1
      },
      {
        id: 6,
        question: "What is a decentralized autonomous organization (DAO)?",
        options: [
          "A traditional corporation",
          "An organization governed by smart contracts and token holders",
          "A government agency",
          "A type of cryptocurrency exchange"
        ],
        correctAnswer: 1,
        points: 1
      },
      {
        id: 7,
        question: "What does 'HODL' mean in cryptocurrency?",
        options: [
          "Hold On for Dear Life",
          "High Order Digital Ledger",
          "Holding Optimized Digital Liquidity",
          "Hard Offering Decentralized Lending"
        ],
        correctAnswer: 0,
        points: 1
      },
      {
        id: 8,
        question: "What is a blockchain fork?",
        options: [
          "A physical division of the blockchain",
          "A change to the blockchain protocol rules",
          "A type of cryptocurrency wallet",
          "A mining tool"
        ],
        correctAnswer: 1,
        points: 1
      },
      {
        id: 9,
        question: "What is the main purpose of a cryptocurrency wallet?",
        options: [
          "To mine cryptocurrencies",
          "To store private keys and manage digital assets",
          "To create new blockchains",
          "To validate transactions"
        ],
        correctAnswer: 1,
        points: 1
      },
      {
        id: 10,
        question: "What does 'staking' mean in blockchain?",
        options: [
          "Selling cryptocurrencies",
          "Locking up tokens to support network operations and earn rewards",
          "Creating new tokens",
          "Trading on exchanges"
        ],
        correctAnswer: 1,
        points: 1
      }
    ]
  },
  {
    id: 2,
    title: "Cryptocurrency Knowledge",
    description: "Test your understanding of cryptocurrencies and trading",
    totalPoints: 10,
    questions: [
      {
        id: 11,
        question: "Who created Bitcoin?",
        options: [
          "Vitalik Buterin",
          "Satoshi Nakamoto",
          "Elon Musk",
          "Mark Zuckerberg"
        ],
        correctAnswer: 1,
        points: 1
      },
      {
        id: 12,
        question: "What is the maximum supply of Bitcoin?",
        options: [
          "21 million",
          "100 million",
          "1 billion",
          "Unlimited"
        ],
        correctAnswer: 0,
        points: 1
      },
      {
        id: 13,
        question: "What is a blockchain?",
        options: [
          "A type of cryptocurrency",
          "A distributed ledger technology",
          "A mining algorithm",
          "A wallet application"
        ],
        correctAnswer: 1,
        points: 1
      },
      {
        id: 14,
        question: "What does DeFi stand for?",
        options: [
          "Digital Finance",
          "Decentralized Finance",
          "Defined Finance",
          "Default Finance"
        ],
        correctAnswer: 1,
        points: 1
      },
      {
        id: 15,
        question: "What is a 'bull market' in cryptocurrency?",
        options: [
          "A market with declining prices",
          "A market with rising prices",
          "A market with stable prices",
          "A market with high volatility"
        ],
        correctAnswer: 1,
        points: 1
      },
      {
        id: 16,
        question: "What is 'market cap' in cryptocurrency?",
        options: [
          "The maximum price of a coin",
          "The total value of all coins in circulation",
          "The number of coins mined per day",
          "The trading volume"
        ],
        correctAnswer: 1,
        points: 1
      },
      {
        id: 17,
        question: "What is a 'hard fork' in blockchain?",
        options: [
          "A minor update to the blockchain",
          "A permanent divergence from the original blockchain",
          "A temporary network split",
          "A type of mining equipment"
        ],
        correctAnswer: 1,
        points: 1
      },
      {
        id: 18,
        question: "What does FOMO stand for in trading?",
        options: [
          "Fear of Missing Out",
          "Financial Options Market Order",
          "Full Order Market Operation",
          "Future Oriented Money Option"
        ],
        correctAnswer: 0,
        points: 1
      },
      {
        id: 19,
        question: "What is a cryptocurrency exchange?",
        options: [
          "A place to mine cryptocurrencies",
          "A platform for buying and selling cryptocurrencies",
          "A type of wallet",
          "A blockchain network"
        ],
        correctAnswer: 1,
        points: 1
      },
      {
        id: 20,
        question: "What is 'liquidity' in cryptocurrency markets?",
        options: [
          "The physical form of cryptocurrency",
          "How easily an asset can be bought or sold",
          "The speed of transactions",
          "The security of the blockchain"
        ],
        correctAnswer: 1,
        points: 1
      }
    ]
  }
];