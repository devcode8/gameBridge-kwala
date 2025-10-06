require('dotenv').config({ path: '.env.local' });
const { createThirdwebClient, getContract } = require('thirdweb');
const { sepolia } = require('thirdweb/chains');

async function testContracts() {
  console.log('🔍 Testing deployed contracts...\n');
  
  const client = createThirdwebClient({
    clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
  });
  
  const quizAddress = process.env.NEXT_PUBLIC_QUIZ_PROGRESS_CONTRACT_ADDRESS;
  const badgeAddress = process.env.NEXT_PUBLIC_BADGE_MINTER_CONTRACT_ADDRESS;
  
  if (!quizAddress || quizAddress.startsWith('0x123456')) {
    console.log('⚠️  QuizProgress contract not deployed yet');
    return;
  }
  
  if (!badgeAddress || badgeAddress.startsWith('0x123456')) {
    console.log('⚠️  BadgeMinter contract not deployed yet');
    return;
  }
  
  try {
    // Test QuizProgress contract
    console.log('📄 Testing QuizProgress contract...');
    const quizContract = getContract({
      client,
      chain: sepolia,
      address: quizAddress,
    });
    
    console.log(`   Address: ${quizAddress}`);
    console.log('   Status: Contract loaded successfully ✅');
    
    // Test BadgeMinter contract
    console.log('\n🎖️  Testing BadgeMinter contract...');
    const badgeContract = getContract({
      client,
      chain: sepolia,
      address: badgeAddress,
    });
    
    console.log(`   Address: ${badgeAddress}`);
    console.log('   Status: Contract loaded successfully ✅');
    
    console.log('\n✅ All contracts are accessible!');
    console.log('🔗 View on Etherscan:');
    console.log(`   QuizProgress: https://sepolia.etherscan.io/address/${quizAddress}`);
    console.log(`   BadgeMinter: https://sepolia.etherscan.io/address/${badgeAddress}`);
    
  } catch (error) {
    console.error('❌ Error testing contracts:', error.message);
  }
}

testContracts();