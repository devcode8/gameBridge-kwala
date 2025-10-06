import { createThirdwebClient } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { privateKeyToAccount } from "thirdweb/wallets";
import { deployPublishedContract } from "thirdweb/deploys";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

interface DeploymentConfig {
  clientId: string;
  secretKey: string;
  privateKey: string;
  kwalaOperatorAddress: string;
}

interface ContractAddresses {
  quizProgress: string;
  badgeMinter: string;
}

class ContractDeployer {
  private client: any;
  private account: any;
  private config: DeploymentConfig;

  constructor() {
    this.validateEnvironment();
    this.config = {
      clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
      secretKey: process.env.THIRDWEB_SECRET_KEY!,
      privateKey: process.env.DEPLOYER_PRIVATE_KEY!,
      kwalaOperatorAddress: process.env.KWALA_OPERATOR_WALLET_ADDRESS!,
    };

    this.client = createThirdwebClient({
      clientId: this.config.clientId,
      secretKey: this.config.secretKey,
    });

    this.account = privateKeyToAccount({
      client: this.client,
      privateKey: this.config.privateKey,
    });
  }

  private validateEnvironment(): void {
    const requiredEnvVars = [
      'NEXT_PUBLIC_THIRDWEB_CLIENT_ID',
      'THIRDWEB_SECRET_KEY',
      'DEPLOYER_PRIVATE_KEY',
      'KWALA_OPERATOR_WALLET_ADDRESS'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error('❌ Missing required environment variables:');
      missingVars.forEach(varName => console.error(`   - ${varName}`));
      console.error('\nPlease check your .env.local file and ensure all variables are set.');
      process.exit(1);
    }

    console.log('✅ Environment variables validated');
  }

  async deployQuizProgress(): Promise<string> {
    console.log('\n📄 Deploying QuizProgress contract...');
    
    try {
      // For thirdweb SDK deployment, we would typically use:
      // const address = await deployPublishedContract({
      //   client: this.client,
      //   chain: sepolia,
      //   account: this.account,
      //   contractId: "QuizProgress", // This would be your published contract ID
      //   constructorParams: [], // No constructor params for QuizProgress
      // });

      // Since we're using custom contracts, let's use the CLI approach with SDK wrapper
      console.log('⚠️  For custom contracts, using thirdweb deploy CLI is recommended');
      console.log('📋 Please run: npx thirdweb deploy contracts/QuizProgress.sol');
      console.log('🔗 This will open the thirdweb dashboard for deployment');
      
      // Return placeholder for now - you'll need to update this after manual deployment
      return 'DEPLOY_QUIZ_PROGRESS_MANUALLY';
    } catch (error) {
      console.error('❌ Error deploying QuizProgress:', error);
      throw error;
    }
  }

  async deployBadgeMinter(): Promise<string> {
    console.log('\n🎖️  Deploying SimpleBadgeMinter contract...');
    
    try {
      // Similar approach for BadgeMinter
      console.log('⚠️  For custom contracts, using thirdweb deploy CLI is recommended');
      console.log('📋 Please run: npx thirdweb deploy contracts/SimpleBadgeMinter.sol');
      console.log('🔗 This will open the thirdweb dashboard for deployment');
      
      return 'DEPLOY_BADGE_MINTER_MANUALLY';
    } catch (error) {
      console.error('❌ Error deploying SimpleBadgeMinter:', error);
      throw error;
    }
  }

  async updateEnvironmentFile(addresses: ContractAddresses): Promise<void> {
    console.log('\n📝 Updating .env.local with deployed addresses...');
    
    try {
      const envPath = path.join(process.cwd(), '.env.local');
      let envContent = fs.readFileSync(envPath, 'utf8');
      
      // Update contract addresses
      envContent = envContent.replace(
        /NEXT_PUBLIC_QUIZ_PROGRESS_CONTRACT_ADDRESS=.*/,
        `NEXT_PUBLIC_QUIZ_PROGRESS_CONTRACT_ADDRESS=${addresses.quizProgress}`
      );
      
      envContent = envContent.replace(
        /NEXT_PUBLIC_BADGE_MINTER_CONTRACT_ADDRESS=.*/,
        `NEXT_PUBLIC_BADGE_MINTER_CONTRACT_ADDRESS=${addresses.badgeMinter}`
      );
      
      fs.writeFileSync(envPath, envContent);
      console.log('✅ Environment file updated');
    } catch (error) {
      console.error('❌ Error updating environment file:', error);
      throw error;
    }
  }

  async updateContractFile(addresses: ContractAddresses): Promise<void> {
    console.log('\n🔧 Updating contract utilities file...');
    
    try {
      const contractPath = path.join(process.cwd(), 'src/utils/contract.ts');
      let contractContent = fs.readFileSync(contractPath, 'utf8');
      
      // Update contract addresses in the file
      contractContent = contractContent.replace(
        /export const QUIZ_PROGRESS_CONTRACT_ADDRESS = ".*";/,
        `export const QUIZ_PROGRESS_CONTRACT_ADDRESS = "${addresses.quizProgress}";`
      );
      
      contractContent = contractContent.replace(
        /export const BADGE_MINTER_CONTRACT_ADDRESS = ".*";/,
        `export const BADGE_MINTER_CONTRACT_ADDRESS = "${addresses.badgeMinter}";`
      );
      
      fs.writeFileSync(contractPath, contractContent);
      console.log('✅ Contract utilities file updated');
    } catch (error) {
      console.error('❌ Error updating contract file:', error);
      throw error;
    }
  }

  configureContracts(addresses: ContractAddresses): void {
    console.log('\n⚙️  Configuring contract relationships...');
    
    try {
      console.log('📋 Manual configuration required:');
      console.log(`   1. Set Badge Minter address in QuizProgress: ${addresses.badgeMinter}`);
      console.log(`   2. Set Kwala Operator in BadgeMinter: ${this.config.kwalaOperatorAddress}`);
      console.log(`   3. Set QuizProgress address in BadgeMinter: ${addresses.quizProgress}`);
      
      console.log('\n🔧 Use these function calls:');
      console.log(`   QuizProgress.setBadgeMinterContract("${addresses.badgeMinter}")`);
      console.log(`   BadgeMinter.setKwalaOperator("${this.config.kwalaOperatorAddress}")`);
      console.log(`   BadgeMinter.setQuizProgressContract("${addresses.quizProgress}")`);
    } catch (error) {
      console.error('❌ Error configuring contracts:', error);
      throw error;
    }
  }

  async deployAll(): Promise<void> {
    console.log('🚀 Starting contract deployment process...');
    console.log(`📍 Network: Sepolia Testnet`);
    console.log(`👤 Deployer: ${this.account.address}`);
    console.log(`🏭 Kwala Operator: ${this.config.kwalaOperatorAddress}`);
    
    try {
      // Deploy contracts
      const quizProgressAddress = await this.deployQuizProgress();
      const badgeMinterAddress = await this.deployBadgeMinter();
      
      const addresses: ContractAddresses = {
        quizProgress: quizProgressAddress,
        badgeMinter: badgeMinterAddress,
      };
      
      // Only update files if we have real addresses
      if (!quizProgressAddress.startsWith('DEPLOY_') && !badgeMinterAddress.startsWith('DEPLOY_')) {
        await this.updateEnvironmentFile(addresses);
        await this.updateContractFile(addresses);
        this.configureContracts(addresses);
        
        console.log('\n🎉 Deployment completed successfully!');
        console.log(`📄 QuizProgress: ${addresses.quizProgress}`);
        console.log(`🎖️  BadgeMinter: ${addresses.badgeMinter}`);
      } else {
        console.log('\n📋 Manual Deployment Required:');
        console.log('Please deploy contracts manually using the thirdweb CLI as indicated above.');
        console.log('After deployment, update the addresses in this script and run the configuration steps.');
      }
      
    } catch (error) {
      console.error('❌ Deployment failed:', error);
      process.exit(1);
    }
  }
}

// Alternative deployment using CLI wrapper
async function deployWithCLI(): Promise<void> {
  console.log('🚀 Alternative: Using thirdweb CLI for deployment');
  console.log('\n📋 Step-by-step manual deployment:');
  
  console.log('\n1️⃣ Deploy QuizProgress Contract:');
  console.log('   npx thirdweb deploy contracts/QuizProgress.sol');
  console.log('   - Select Sepolia network');
  console.log('   - Copy the deployed address');
  
  console.log('\n2️⃣ Deploy SimpleBadgeMinter Contract:');
  console.log('   npx thirdweb deploy contracts/SimpleBadgeMinter.sol');
  console.log('   - Select Sepolia network');
  console.log('   - Copy the deployed address');
  
  console.log('\n3️⃣ Update Environment Variables:');
  console.log('   NEXT_PUBLIC_QUIZ_PROGRESS_CONTRACT_ADDRESS=<quiz_progress_address>');
  console.log('   NEXT_PUBLIC_BADGE_MINTER_CONTRACT_ADDRESS=<badge_minter_address>');
  
  console.log('\n4️⃣ Configure Contract Relationships:');
  console.log('   Call setBadgeMinterContract() on QuizProgress');
  console.log('   Call setKwalaOperator() on BadgeMinter');
  console.log('   Call setQuizProgressContract() on BadgeMinter');
  
  console.log('\n📝 Documentation: See DEPLOYMENT-GUIDE.md for detailed instructions');
}

// Main execution
async function main(): Promise<void> {
  const deployer = new ContractDeployer();
  
  // Check if we want to use SDK deployment or CLI guidance
  const useSDK = process.argv.includes('--sdk');
  
  if (useSDK) {
    await deployer.deployAll();
  } else {
    await deployWithCLI();
  }
}

// Execute if run directly
if (require.main === module) {
  main().catch(console.error);
}

export { ContractDeployer, deployWithCLI };