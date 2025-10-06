# 🎮 GameBridge — Cross-Chain Achievement Badges for Gamers

**GameBridge** is a Web3 project that creates a **global achievement layer** for gamers — powered by **Kwala’s decentralized workflow automation**.  
It unifies player achievements across multiple blockchains, minting **verifiable, cross-chain badges** that represent in-game milestones, tournament wins, or learning progress.

---

## 🚀 Problem Statement

Gamers today play across multiple Web3 ecosystems — Ethereum, Solana, Polygon, etc.  
Each game keeps achievements isolated, making it impossible to carry a consistent identity or skill record across platforms.

- No unified gaming reputation.  
- No automated reward system.  
- Manual verification for esports and tournaments.  
- Missed opportunities for loyalty or cross-platform rewards.

---

## ⚙️ Solution

**GameBridge** introduces a **cross-chain achievement system** that listens to in-game smart contract events and automatically mints **badge NFTs** for players.  
Using **Kwala**, the entire process — from event detection to NFT minting — is automated and verifiable on-chain.

### Key Features

- 🧩 **Global Achievement Layer:** Unified progress tracking across games and chains.  
- ⚡ **Event-Driven Automation:** Kwala listens to contract events (e.g., `HighScore`, `QuestComplete`) and triggers badge minting.  
- 🔐 **Verifiable Badges:** NFTs act as proof of skill, loyalty, or participation.  
- 🌉 **Cross-Chain Support:** Works with multiple game ecosystems and chains.  
- 🧠 **Plug-and-Play Integration:** Easy to integrate for game studios, esports orgs, or academies.

---

## 🧱 Architecture Overview

1. **Frontend (React + Web3.js)**  
   - Players connect wallets (MetaMask).  
   - Play games or quizzes and view earned badges.

2. **Smart Contracts (Solidity)**  
   - Emit events like `HighScore(address player, uint256 score)`.  
   - Store player achievement metadata.

3. **Kwala Workflow Automation**  
   - Detects smart contract events.  
   - Triggers NFT minting via on-chain call using the x402 protocol.  
   - Example workflow: [View Kwala Flow](https://kwala.network/yaml-editor?yaml=Name%3A+GameFlow1_132f%0ATrigger%3A%0A++TriggerSourceContract%3A+0x0667F1ddF266efD3f58931e1D95bc4C5a58C0870%0A++TriggerChainID%3A+80002%0A++TriggerEventName%3A+NA%0A++TriggerEventFilter%3A+NA%0A++TriggerSourceContractABI%3A+NA%0A++TriggerPrice%3A+NA%0A++RecurringSourceContract%3A+NA%0A++RecurringChainID%3A+80002%0A++RecurringEventName%3A+NA%0A++RecurringEventFilter%3A+NA%0A++RecurringSourceContractABI%3A+NA%0A++RecurringPrice%3A+NA%0A++RepeatEvery%3A+NA%0A++ExecuteAfter%3A+immediate%0A++ExpiresIn%3A+1798741799%0A++Meta%3A+NA%0A++ActionStatusNotificationPOSTURL%3A+https%3A%2F%2Fworkflow-notification-test.kalp.network%2Fpush_notification%0A++ActionStatusNotificationAPIKey%3A+NA%0AActions%3A%0A++-+Name%3A+MintStandardBadge%0A++++Type%3A+call%0A++++APIEndpoint%3A+NA%0A++++APIPayload%3A%0A++++++Message%3A+NA%0A++++TargetContract%3A+0x0aCc63313E429C6adc8853651DD63570670EFA8c%0A++++TargetFunction%3A+function+mintBadge%28address+to%2Cuint256+quizId%2Cuint256+score%2Cuint256+totalQuestions%2Cstring+badgeLevel%2Cbool+isHighScore%2Cbool+isFirstAttempt%29%0A++++TargetParams%3A%0A++++++-+%24%7Bevent.user%7D%0A++++++-+%24%7Bevent.quizId%7D%0A++++++-+%24%7Bevent.score%7D%0A++++++-+%24%7Bevent.totalQuestions%7D%0A++++++-+%24%7Bevent.badgeLevel%7D%0A++++++-+%24%7Bevent.isHighScore%7D%0A++++++-+%24%7Bevent.isFirstAttempt%7D%0A++++ChainID%3A+11155111%0A++++EncodedABI%3A+NA%0A++++Bytecode%3A+NA%0A++++Metadata%3A+NA%0A++++RetriesUntilSuccess%3A+5%0AExecution%3A%0A++Mode%3A+sequential%0A&name=GameFlow1_132f&status=WORKFLOW_DEPLOYED&workflowId=GameFlow1_132f&lastRun=1h+9m+ago&nextRun=1h+3m+ago&lastSaved=06%2F10%2F2025%2C+20%3A05%3A+32)

4. **Badge Minting Service**  
   - Issues NFT badges and updates player collection.

---

## 🧩 Demo Flow

1. **Login with MetaMask** on the GameBridge platform.  
2. Choose a game or quiz and play.  
3. Upon completion, a **smart contract event** (e.g., `HighScore`) is emitted.  
4. **Kwala** detects the event and automatically mints a badge NFT.  
5. Check your collection — your new badge appears on-chain.  

🎥 **Watch the Demo:** [https://youtu.be/owvgsOb44KU](https://youtu.be/owvgsOb44KU)

---

## 🔮 Future Scope

- **Cross-Platform Integration:** Connect Web3 games, esports platforms, and learning academies.  
- **Automated Rewards:** Auto-mint badges for completing ecosystems or winning tournaments.  
- **Developer SDK:** Simple integration kit for game studios.  
- **Portable Gamer Identity:** One on-chain reputation across all games.

---

## 🧰 Tech Stack

- **Frontend:** React, Web3.js  
- **Smart Contracts:** Solidity, Hardhat  
- **Automation:** Kwala (Event-based workflows)  
- **Blockchain:** Ethereum testnet (Sepolia) & Polygon testnet  
- **Storage:** IPFS / Pinata for badge metadata  

---

## 🪙 Example Contract Event

```solidity
event HighScore(address indexed player, uint256 score);
```

When this event is emitted, Kwala detects it and calls the NFT minting endpoint automatically.

---

## 💡 Who Can Use GameBridge

* Web3 Gaming Studios (Immutable, Gala Games, Aurory)
* Esports Platforms (Community Gaming, Zebedee)
* Player Guilds (Yield Guild Games, Ready Player DAO)
* Web3 Learning Platforms and Academies

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to add or modify.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🧠 Created For

Built during a Web3 hackathon to demonstrate **decentralized automation in gaming** using **Kwala**.
GameBridge aims to make Web3 gaming **transparent, interoperable, and automated.**

