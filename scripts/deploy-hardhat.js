const { ethers } = require("hardhat");
const fs = require("fs");
require("dotenv").config({ path: ".env.local" });

async function main() {
  console.log("🚀 Starting contract deployment...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📍 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy QuizProgress contract
  console.log("\n📄 Deploying QuizProgress contract...");
  const QuizProgress = await ethers.getContractFactory("QuizProgress");
  const quizProgress = await QuizProgress.deploy();
  await quizProgress.waitForDeployment();
  const quizProgressAddress = await quizProgress.getAddress();
  console.log("✅ QuizProgress deployed to:", quizProgressAddress);

  // Deploy BadgeMinter contract
  console.log("\n🎖️  Deploying BadgeMinter contract...");
  const BadgeMinter = await ethers.getContractFactory("BadgeMinter");
  const badgeMinter = await BadgeMinter.deploy("Quiz Badge", "QBADGE");
  await badgeMinter.waitForDeployment();
  const badgeMinterAddress = await badgeMinter.getAddress();
  console.log("✅ BadgeMinter deployed to:", badgeMinterAddress);

  // Configure contract relationships
  console.log("\n⚙️  Configuring contract relationships...");
  
  // Set badge minter in quiz progress
  const setBadgeMinterTx = await quizProgress.setBadgeMinterContract(badgeMinterAddress);
  await setBadgeMinterTx.wait();
  console.log("✅ Set badge minter contract in QuizProgress");

  // Set quiz progress in badge minter
  const setQuizProgressTx = await badgeMinter.setQuizProgressContract(quizProgressAddress);
  await setQuizProgressTx.wait();
  console.log("✅ Set quiz progress contract in BadgeMinter");

  // Set Kwala operator (use deployer for now if not specified)
  const kwalaOperator = process.env.KWALA_OPERATOR_WALLET_ADDRESS || deployer.address;
  const setOperatorTx = await badgeMinter.setKwalaOperator(kwalaOperator);
  await setOperatorTx.wait();
  console.log("✅ Set Kwala operator in BadgeMinter:", kwalaOperator);

  // Update .env.local file
  console.log("\n📝 Updating .env.local file...");
  const envPath = ".env.local";
  let envContent = fs.readFileSync(envPath, "utf8");

  envContent = envContent.replace(
    /NEXT_PUBLIC_QUIZ_PROGRESS_CONTRACT_ADDRESS=.*/,
    `NEXT_PUBLIC_QUIZ_PROGRESS_CONTRACT_ADDRESS=${quizProgressAddress}`
  );

  envContent = envContent.replace(
    /NEXT_PUBLIC_BADGE_MINTER_CONTRACT_ADDRESS=.*/,
    `NEXT_PUBLIC_BADGE_MINTER_CONTRACT_ADDRESS=${badgeMinterAddress}`
  );

  fs.writeFileSync(envPath, envContent);
  console.log("✅ Environment file updated");

  // Update badge URIs with IPFS CID for different levels
  console.log("\n🌐 Setting up badge URIs with IPFS...");
  const ipfsCID = "bafybeie3zikearfd4cvobe3gxblwlzlctmgag3lpztooi6r44ncissihde";
  
  const badgeLevels = [
    "Perfect Score",
    "Excellent", 
    "Great",
    "Good",
    "Above Average",
    "Average",
    "Fair",
    "Below Average",
    "Poor",
    "Basic"
  ];

  const badgeNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  for (let i = 0; i < badgeLevels.length; i++) {
    const uri = `https://ipfs.io/ipfs/${ipfsCID}/${badgeNumbers[i]}.png`;
    const setUriTx = await badgeMinter.setBadgeURI(badgeLevels[i], uri);
    await setUriTx.wait();
    console.log(`✅ Set URI for ${badgeLevels[i]}: ${uri}`);
  }

  console.log("\n🎉 Deployment completed successfully!");
  console.log("📄 QuizProgress contract:", quizProgressAddress);
  console.log("🎖️  BadgeMinter contract:", badgeMinterAddress);
  console.log("🌐 IPFS CID for badges:", ipfsCID);
  
  console.log("\n📋 Summary:");
  console.log("- Contracts deployed and configured");
  console.log("- Environment variables updated");
  console.log("- Badge URIs set to IPFS");
  console.log("- Ready for frontend integration!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });