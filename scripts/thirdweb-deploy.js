const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

class ThirdwebDeployer {
  constructor() {
    this.validateEnvironment();
  }

  validateEnvironment() {
    const requiredVars = [
      'NEXT_PUBLIC_THIRDWEB_CLIENT_ID',
      'DEPLOYER_PRIVATE_KEY'
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error('❌ Missing required environment variables:');
      missingVars.forEach(varName => console.error(`   - ${varName}`));
      process.exit(1);
    }

    console.log('✅ Environment variables validated');
  }

  async deployContract(contractPath, contractName) {
    console.log(`\n🚀 Deploying ${contractName}...`);
    
    try {
      // Create a deployment command
      const deployCmd = `npx thirdweb deploy ${contractPath} --ci`;
      
      console.log(`📋 Command: ${deployCmd}`);
      console.log('⚠️  Note: This will open in browser for manual completion');
      
      // For automated deployment, we'd need the contract to be published first
      // For now, we'll provide the manual steps
      
      return null; // Will be updated after manual deployment
    } catch (error) {
      console.error(`❌ Error deploying ${contractName}:`, error.message);
      throw error;
    }
  }

  updateAddresses(quizProgressAddress, badgeMinterAddress) {
    console.log('\n📝 Updating contract addresses...');
    
    // Update .env.local
    const envPath = '.env.local';
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    envContent = envContent.replace(
      /NEXT_PUBLIC_QUIZ_PROGRESS_CONTRACT_ADDRESS=.*/,
      `NEXT_PUBLIC_QUIZ_PROGRESS_CONTRACT_ADDRESS=${quizProgressAddress}`
    );
    
    envContent = envContent.replace(
      /NEXT_PUBLIC_BADGE_MINTER_CONTRACT_ADDRESS=.*/,
      `NEXT_PUBLIC_BADGE_MINTER_CONTRACT_ADDRESS=${badgeMinterAddress}`
    );
    
    fs.writeFileSync(envPath, envContent);
    
    // Update contract.ts
    const contractPath = 'src/utils/contract.ts';
    let contractContent = fs.readFileSync(contractPath, 'utf8');
    
    contractContent = contractContent.replace(
      /export const QUIZ_PROGRESS_CONTRACT_ADDRESS = ".*";/,
      `export const QUIZ_PROGRESS_CONTRACT_ADDRESS = "${quizProgressAddress}";`
    );
    
    contractContent = contractContent.replace(
      /export const BADGE_MINTER_CONTRACT_ADDRESS = ".*";/,
      `export const BADGE_MINTER_CONTRACT_ADDRESS = "${badgeMinterAddress}";`
    );
    
    fs.writeFileSync(contractPath, contractContent);
    
    console.log('✅ Contract addresses updated');
  }

  generateConfigurationScript(quizProgressAddress, badgeMinterAddress) {
    const kwalaOperator = process.env.KWALA_OPERATOR_WALLET_ADDRESS || 'YOUR_KWALA_OPERATOR_ADDRESS';
    
    const script = `
// Configuration script for deployed contracts
// Run these commands in thirdweb dashboard or through your wallet

// 1. Configure QuizProgress contract
await quizProgressContract.setBadgeMinterContract("${badgeMinterAddress}");

// 2. Configure BadgeMinter contract  
await badgeMinterContract.setKwalaOperator("${kwalaOperator}");
await badgeMinterContract.setQuizProgressContract("${quizProgressAddress}");

console.log("✅ Contract configuration completed");
`;

    fs.writeFileSync('scripts/configure-contracts.js', script);
    console.log('📄 Configuration script created: scripts/configure-contracts.js');
  }

  async deployAll() {
    console.log('🚀 Starting thirdweb deployment process...');
    
    console.log('\n📋 Manual Deployment Steps:');
    console.log('1. Deploy QuizProgress contract');
    console.log('2. Deploy SimpleBadgeMinter contract');
    console.log('3. Update addresses in environment');
    console.log('4. Configure contract relationships');
    
    // For now, provide manual instructions
    console.log('\n🔧 Manual Deployment Commands:');
    console.log('npx thirdweb deploy contracts/QuizProgress.sol');
    console.log('npx thirdweb deploy contracts/SimpleBadgeMinter.sol');
    
    console.log('\n⚠️  After deployment:');
    console.log('1. Copy the deployed addresses');
    console.log('2. Run: node scripts/update-addresses.js <quiz_address> <badge_address>');
    console.log('3. Configure contracts using the generated script');
  }
}

// Helper script to update addresses after manual deployment
if (process.argv[2] === 'update-addresses') {
  const quizAddress = process.argv[3];
  const badgeAddress = process.argv[4];
  
  if (!quizAddress || !badgeAddress) {
    console.error('Usage: node scripts/thirdweb-deploy.js update-addresses <quiz_address> <badge_address>');
    process.exit(1);
  }
  
  const deployer = new ThirdwebDeployer();
  deployer.updateAddresses(quizAddress, badgeAddress);
  deployer.generateConfigurationScript(quizAddress, badgeAddress);
  
  console.log('✅ Addresses updated successfully!');
} else {
  // Run main deployment
  const deployer = new ThirdwebDeployer();
  deployer.deployAll().catch(console.error);
}