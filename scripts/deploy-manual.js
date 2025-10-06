const fs = require("fs");
require("dotenv").config({ path: ".env.local" });

function updateContractAddresses(quizProgressAddress, badgeMinterAddress) {
  console.log("📝 Updating contract addresses...");
  
  // Update .env.local
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
  
  // Save deployment info
  const deploymentInfo = {
    quizProgress: quizProgressAddress,
    badgeMinter: badgeMinterAddress,
    kwalaOperator: process.env.KWALA_OPERATOR_WALLET_ADDRESS,
    ipfsCID: "bafybeie3zikearfd4cvobe3gxblwlzlctmgag3lpztooi6r44ncissihde",
    network: "sepolia",
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync("deployment-info.json", JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 Deployment info saved to deployment-info.json");
}

function generateManualInstructions() {
  console.log("🚀 Manual Contract Deployment Instructions");
  console.log("==========================================");
  
  console.log("\n1️⃣ Deploy QuizProgress Contract:");
  console.log("   npx thirdweb deploy contracts/QuizProgress.sol");
  console.log("   - This will open in your browser");
  console.log("   - Select Sepolia network");
  console.log("   - No constructor parameters needed");
  console.log("   - Copy the deployed address");
  
  console.log("\n2️⃣ Deploy BadgeMinter Contract:");
  console.log("   npx thirdweb deploy contracts/BadgeMinter.sol");
  console.log("   - This will open in your browser");
  console.log("   - Select Sepolia network");
  console.log("   - Constructor parameters:");
  console.log('     _name: "Quiz Badge"');
  console.log('     _symbol: "QBADGE"');
  console.log("   - Copy the deployed address");
  
  console.log("\n3️⃣ Update Addresses:");
  console.log("   node scripts/deploy-manual.js update <quiz_address> <badge_address>");
  
  console.log("\n4️⃣ Configure Contracts (in thirdweb dashboard):");
  console.log("   QuizProgress contract:");
  console.log(`   - Call setBadgeMinterContract with: <badge_minter_address>`);
  
  console.log("\n   BadgeMinter contract:");
  console.log(`   - Call setKwalaOperator with: ${process.env.KWALA_OPERATOR_WALLET_ADDRESS}`);
  console.log(`   - Call setQuizProgressContract with: <quiz_progress_address>`);
  
  console.log("\n5️⃣ Set Badge URIs:");
  console.log("   Use the setBadgeURI function for each badge level:");
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
  
  badgeConfig.forEach(badge => {
    const uri = `https://ipfs.io/ipfs/${ipfsCID}/${badge.file}`;
    console.log(`   setBadgeURI("${badge.level}", "${uri}")`);
  });
  
  console.log("\n📋 Environment Variables (will be auto-updated):");
  console.log("   NEXT_PUBLIC_QUIZ_PROGRESS_CONTRACT_ADDRESS");
  console.log("   NEXT_PUBLIC_BADGE_MINTER_CONTRACT_ADDRESS");
  console.log(`   KWALA_OPERATOR_WALLET_ADDRESS: ${process.env.KWALA_OPERATOR_WALLET_ADDRESS}`);
}

// Check if this is an update call
if (process.argv[2] === "update") {
  const quizAddress = process.argv[3];
  const badgeAddress = process.argv[4];
  
  if (!quizAddress || !badgeAddress) {
    console.error("Usage: node scripts/deploy-manual.js update <quiz_address> <badge_address>");
    process.exit(1);
  }
  
  updateContractAddresses(quizAddress, badgeAddress);
  console.log("✅ Addresses updated! Now configure contracts in thirdweb dashboard.");
} else {
  generateManualInstructions();
}