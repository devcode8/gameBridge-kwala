const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🚀 Starting contract deployment on local network...");

  // Get the deployer account (Hardhat's first account)
  const [deployer] = await ethers.getSigners();
  console.log("📍 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)));

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

  // Set Kwala operator (use deployer for local testing)
  const setOperatorTx = await badgeMinter.setKwalaOperator(deployer.address);
  await setOperatorTx.wait();
  console.log("✅ Set Kwala operator in BadgeMinter:", deployer.address);

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

  // Also update the Kwala operator
  envContent = envContent.replace(
    /KWALA_OPERATOR_WALLET_ADDRESS=.*/,
    `KWALA_OPERATOR_WALLET_ADDRESS=${deployer.address}`
  );

  fs.writeFileSync(envPath, envContent);
  console.log("✅ Environment file updated");

  // Update badge URIs with IPFS CID for different levels
  console.log("\n🌐 Setting up badge URIs with IPFS...");
  const ipfsCID = "bafybeie3zikearfd4cvobe3gxblwlzlctmgag3lpztooi6r44ncissihde";
  
  const badgeConfig = [
    { level: "Perfect Score", file: "1.png" },
    { level: "Excellent", file: "2.png" },
    { level: "Great", file: "3.png" },
    { level: "Good", file: "4.png" },
    { level: "Above Average", file: "5.png" },
    { level: "Average", file: "6.png" },
    { level: "Fair", file: "7.png" },
    { level: "Below Average", file: "8.png" },
    { level: "Poor", file: "9.png" },
    { level: "Basic", file: "10.png" }
  ];

  for (const badge of badgeConfig) {
    const uri = `https://ipfs.io/ipfs/${ipfsCID}/${badge.file}`;
    const setUriTx = await badgeMinter.setBadgeURI(badge.level, uri);
    await setUriTx.wait();
    console.log(`✅ Set URI for ${badge.level}: ${uri}`);
  }

  console.log("\n🎉 Deployment completed successfully!");
  console.log("📄 QuizProgress contract:", quizProgressAddress);
  console.log("🎖️  BadgeMinter contract:", badgeMinterAddress);
  console.log("🌐 IPFS CID for badges:", ipfsCID);
  console.log("👤 Kwala Operator:", deployer.address);
  
  console.log("\n📋 Summary:");
  console.log("- Contracts deployed and configured");
  console.log("- Environment variables updated");
  console.log("- Badge URIs set to IPFS");
  console.log("- Ready for frontend integration!");

  // Save deployment info to a file
  const deploymentInfo = {
    quizProgress: quizProgressAddress,
    badgeMinter: badgeMinterAddress,
    kwalaOperator: deployer.address,
    ipfsCID: ipfsCID,
    network: "localhost",
    timestamp: new Date().toISOString()
  };

  fs.writeFileSync("deployment-info.json", JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 Deployment info saved to deployment-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });