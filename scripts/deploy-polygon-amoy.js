const fs = require("fs");
require("dotenv").config({ path: ".env.local" });

function updateContractAddresses(quizProgressAddress, badgeMinterAddress) {
  console.log("📝 Updating contract addresses for Polygon Amoy...");
  
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
    network: "polygon-amoy",
    chainId: 80002,
    quizProgress: quizProgressAddress,
    badgeMinter: badgeMinterAddress,
    kwalaOperator: process.env.KWALA_OPERATOR_WALLET_ADDRESS,
    ipfsCID: "bafybeie3zikearfd4cvobe3gxblwlzlctmgag3lpztooi6r44ncissihde",
    rpcUrl: "https://rpc-amoy.polygon.technology",
    explorer: "https://amoy.polygonscan.com",
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync("deployment-info.json", JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 Deployment info saved to deployment-info.json");
}

function generatePolygonAmoyInstructions() {
  console.log("🚀 Polygon Amoy Contract Deployment Instructions");
  console.log("==============================================");
  
  console.log("\n🔗 Network: Polygon Amoy Testnet");
  console.log("   Chain ID: 80002");
  console.log("   RPC URL: https://rpc-amoy.polygon.technology");
  console.log("   Explorer: https://amoy.polygonscan.com");
  console.log("   Faucet: https://faucet.polygon.technology");
  
  console.log("\n💰 Get Test MATIC:");
  console.log("   1. Visit: https://faucet.polygon.technology");
  console.log("   2. Select 'Polygon Amoy' network");
  console.log("   3. Enter your wallet address");
  console.log("   4. Request test MATIC tokens");
  
  console.log("\n1️⃣ Deploy QuizProgress Contract:");
  console.log("   npx thirdweb deploy contracts/QuizProgress.sol --network polygon-amoy");
  console.log("   - This will open in your browser");
  console.log("   - Select Polygon Amoy network (Chain ID: 80002)");
  console.log("   - No constructor parameters needed");
  console.log("   - Copy the deployed address");
  
  console.log("\n2️⃣ Deploy BadgeMinter Contract:");
  console.log("   npx thirdweb deploy contracts/BadgeMinter.sol --network polygon-amoy");
  console.log("   - This will open in your browser");
  console.log("   - Select Polygon Amoy network (Chain ID: 80002)");
  console.log("   - Constructor parameters:");
  console.log('     _name: "Quiz Badge"');
  console.log('     _symbol: "QBADGE"');
  console.log("   - Copy the deployed address");
  
  console.log("\n3️⃣ Update Addresses:");
  console.log("   node scripts/deploy-polygon-amoy.js update <quiz_address> <badge_address>");
  
  console.log("\n4️⃣ Configure Contracts (in thirdweb dashboard):");
  console.log("   QuizProgress contract:");
  console.log(`   - Call setBadgeMinterContract with: <badge_minter_address>`);
  
  console.log("\n   BadgeMinter contract:");
  console.log(`   - Call setKwalaOperator with: ${process.env.KWALA_OPERATOR_WALLET_ADDRESS || 'YOUR_KWALA_OPERATOR_ADDRESS'}`);
  console.log(`   - Call setQuizProgressContract with: <quiz_progress_address>`);
  
  console.log("\n5️⃣ Set Badge URIs (IPFS):");
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
  
  console.log("\n6️⃣ Set up Kwala Workflow:");
  console.log("   - Copy the kwala-badge-workflow.yml configuration");
  console.log("   - Update contract addresses in the YAML file");
  console.log("   - Deploy workflow to Kwala platform");
  
  console.log("\n📋 Environment Variables (will be auto-updated):");
  console.log("   NEXT_PUBLIC_QUIZ_PROGRESS_CONTRACT_ADDRESS");
  console.log("   NEXT_PUBLIC_BADGE_MINTER_CONTRACT_ADDRESS");
  console.log(`   KWALA_OPERATOR_WALLET_ADDRESS: ${process.env.KWALA_OPERATOR_WALLET_ADDRESS || 'YOUR_KWALA_OPERATOR_ADDRESS'}`);
  
  console.log("\n⚠️  Important Notes:");
  console.log("   - Make sure you have test MATIC in your wallet");
  console.log("   - Set your Kwala operator address in .env.local");
  console.log("   - Update KWALA_API_KEY for workflow deployment");
  console.log("   - Gas fees are much lower on Polygon Amoy");
}

// Check if this is an update call
if (process.argv[2] === "update") {
  const quizAddress = process.argv[3];
  const badgeAddress = process.argv[4];
  
  if (!quizAddress || !badgeAddress) {
    console.error("Usage: node scripts/deploy-polygon-amoy.js update <quiz_address> <badge_address>");
    process.exit(1);
  }
  
  updateContractAddresses(quizAddress, badgeAddress);
  console.log("✅ Addresses updated! Now configure contracts and set up Kwala workflow.");
} else {
  generatePolygonAmoyInstructions();
}