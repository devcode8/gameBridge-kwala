# Quiz Game with Automated Badge Minting

A Next.js quiz application with automated badge minting using Kwala workflows on Polygon Amoy testnet.

## 🌟 Features

- **Interactive Quiz Game** - Multiple choice quizzes with real-time scoring
- **Blockchain Integration** - Smart contracts on Polygon Amoy for quiz results
- **Automated Badge Minting** - Kwala workflows automatically mint NFT badges
- **IPFS Storage** - Decentralized badge image storage
- **Real-time Events** - Contract events trigger badge minting workflows

## 🏗️ Architecture

```
Frontend (Next.js) → QuizProgress Contract → Kwala Workflow → BadgeMinter Contract
                                ↓
                          Event Emission → Automatic Badge Minting
```

## 🚀 Quick Start

### Prerequisites

1. **Wallet Setup**
   - Install MetaMask or compatible Web3 wallet
   - Add Polygon Amoy testnet (Chain ID: 80002)
   - Get test MATIC from [Polygon Faucet](https://faucet.polygon.technology)

2. **Kwala Account**
   - Sign up at [Kwala Network](https://kwala.network)
   - Get your API key from the dashboard

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd quizegame

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
```

### Environment Configuration

Update `.env.local` with your configuration:

```env
# Thirdweb Configuration
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
THIRDWEB_SECRET_KEY=your_thirdweb_secret_key

# Deployment Configuration
DEPLOYER_PRIVATE_KEY=your_wallet_private_key
DEPLOYMENT_NETWORK=polygon-amoy

# Contract Addresses (updated after deployment)
NEXT_PUBLIC_QUIZ_PROGRESS_CONTRACT_ADDRESS=
NEXT_PUBLIC_BADGE_MINTER_CONTRACT_ADDRESS=

# Kwala Configuration
KWALA_OPERATOR_WALLET_ADDRESS=your_kwala_operator_address
KWALA_WORKFLOW_ENDPOINT=https://api.kwala.network/v1/workflows
KWALA_API_KEY=your_kwala_api_key

# Network Configuration
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
POLYGONSCAN_API_KEY=your_polygonscan_api_key
```

## 📜 Smart Contract Deployment

### 1. Deploy to Polygon Amoy

```bash
# Get deployment instructions
node scripts/deploy-polygon-amoy.js

# Deploy QuizProgress contract
npx thirdweb deploy contracts/QuizProgress.sol --network polygon-amoy

# Deploy BadgeMinter contract  
npx thirdweb deploy contracts/BadgeMinter.sol --network polygon-amoy
```

### 2. Update Contract Addresses

```bash
# After deployment, update addresses
node scripts/deploy-polygon-amoy.js update <quiz_progress_address> <badge_minter_address>
```

### 3. Configure Contracts

In the thirdweb dashboard, call these functions:

**QuizProgress Contract:**
```solidity
setBadgeMinterContract("<badge_minter_address>")
```

**BadgeMinter Contract:**
```solidity
setKwalaOperator("<your_kwala_operator_address>")
setQuizProgressContract("<quiz_progress_address>")

// Set badge URIs for each level
setBadgeURI("Perfect Score", "https://ipfs.io/ipfs/bafybeie3zikearfd4cvobe3gxblwlzlctmgag3lpztooi6r44ncissihde/1.png")
setBadgeURI("Excellent", "https://ipfs.io/ipfs/bafybeie3zikearfd4cvobe3gxblwlzlctmgag3lpztooi6r44ncissihde/2.png")
// ... continue for all badge levels
```

## 🔄 Kwala Workflow Setup

### 1. Prepare Workflow Configuration

The `kwala-badge-workflow.yml` file contains three automated workflows:

1. **QuizBadgeMinting_Auto** - Mints badges for quiz completions
2. **HighScoreBadgeMinting_Auto** - Special badges for high scores  
3. **PerfectScoreBadgeMinting_Auto** - Diamond badges for perfect scores

### 2. Update Contract Addresses

Edit `kwala-badge-workflow.yml` and replace:
```yaml
TriggerSourceContract: "YOUR_QUIZ_PROGRESS_CONTRACT_ADDRESS"
TargetContract: "YOUR_BADGE_MINTER_CONTRACT_ADDRESS"
```

### 3. Deploy Workflows to Kwala

```bash
# Using Kwala CLI (if available)
kwala workflow deploy kwala-badge-workflow.yml

# Or via API
curl -X POST "https://api.kwala.network/v1/workflows" \
  -H "Authorization: Bearer YOUR_KWALA_API_KEY" \
  -H "Content-Type: application/yaml" \
  --data-binary @kwala-badge-workflow.yml
```

### 4. Workflow Events

The workflows listen for these contract events:

**KwalaBadgeRequest Event:**
```solidity
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
```

## 🎨 Badge System

### Badge Levels & IPFS Storage

| Score | Badge Level | IPFS File | Rarity |
|-------|-------------|-----------|--------|
| 10/10 | Perfect Score | `1.png` | Diamond |
| 9/10 | Excellent | `2.png` | Gold |
| 8/10 | Great | `3.png` | Gold |
| 7/10 | Good | `4.png` | Silver |
| 6/10 | Above Average | `5.png` | Silver |
| 5/10 | Average | `6.png` | Bronze |
| 4/10 | Fair | `7.png` | Bronze |
| 3/10 | Below Average | `8.png` | Bronze |
| 2/10 | Poor | `9.png` | Bronze |
| 1/10 | Basic | `10.png` | Bronze |

**IPFS CID:** `bafybeie3zikearfd4cvobe3gxblwlzlctmgag3lpztooi6r44ncissihde`

## 🔧 Development

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm start
```

## 🧪 Testing

### Test Quiz Flow

1. Connect your wallet to Polygon Amoy
2. Take a quiz and submit results
3. Check contract events in PolygonScan
4. Verify badge minting in Kwala dashboard
5. View minted badges in your wallet

## 📊 Monitoring

### Kwala Dashboard

Monitor workflow executions at:
- **Workflows:** https://app.kwala.network/workflows
- **Executions:** https://app.kwala.network/executions
- **Logs:** View detailed execution logs and errors

### Blockchain Explorer

Track transactions on:
- **Polygon Amoy:** https://amoy.polygonscan.com
- Search for your contract addresses
- Monitor event emissions and badge minting

## 🚨 Troubleshooting

### Common Issues

**1. "Deceptive request" in MetaMask**
- Ensure you're using real deployed contract addresses
- Avoid using sample/placeholder addresses
- Deploy contracts to Polygon Amoy testnet

**2. Badge images not loading**
- Verify IPFS CID in configuration
- Check Next.js image configuration for IPFS domains
- Try alternative IPFS gateways

**3. Kwala workflow not triggering**
- Verify contract addresses in YAML configuration
- Check event emission in contract transactions
- Ensure Kwala operator has sufficient MATIC

### Support

- **Kwala Documentation:** https://kwala.network/docs
- **Polygon Docs:** https://docs.polygon.technology
- **Thirdweb Docs:** https://portal.thirdweb.com

---

**Happy Quiz Gaming! 🎮✨**

Deploy your contracts, set up Kwala workflows, and watch badges mint automatically as users complete quizzes!
