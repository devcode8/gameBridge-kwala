require('dotenv').config({ path: '.env.local' });

const requiredVars = {
  'NEXT_PUBLIC_THIRDWEB_CLIENT_ID': 'thirdweb Client ID',
  'THIRDWEB_SECRET_KEY': 'thirdweb Secret Key (for deployment)',
  'DEPLOYER_PRIVATE_KEY': 'Wallet Private Key (for deployment)',
  'KWALA_OPERATOR_WALLET_ADDRESS': 'Kwala Operator Wallet Address',
  'DATABASE_URL': 'Supabase Database URL'
};

console.log('🔍 Verifying environment configuration...\n');

let hasErrors = false;

Object.entries(requiredVars).forEach(([varName, description]) => {
  const value = process.env[varName];
  
  if (!value) {
    console.log(`❌ ${varName}`);
    console.log(`   Description: ${description}`);
    console.log(`   Status: Missing\n`);
    hasErrors = true;
  } else {
    console.log(`✅ ${varName}`);
    console.log(`   Description: ${description}`);
    console.log(`   Status: Set (${value.substring(0, 10)}...)\n`);
  }
});

const optionalVars = {
  'NEXT_PUBLIC_QUIZ_PROGRESS_CONTRACT_ADDRESS': 'QuizProgress Contract Address',
  'NEXT_PUBLIC_BADGE_MINTER_CONTRACT_ADDRESS': 'Badge Minter Contract Address',
  'SEPOLIA_RPC_URL': 'Sepolia RPC URL',
  'ETHERSCAN_API_KEY': 'Etherscan API Key'
};

console.log('📋 Optional variables (updated after deployment):');
Object.entries(optionalVars).forEach(([varName, description]) => {
  const value = process.env[varName];
  const status = value ? `Set (${value.substring(0, 10)}...)` : 'Not set';
  console.log(`   ${varName}: ${status}`);
});

if (hasErrors) {
  console.log('\n❌ Environment configuration has errors. Please check your .env.local file.');
  console.log('📄 See .env.example for reference.');
  process.exit(1);
} else {
  console.log('\n✅ Environment configuration is valid!');
  console.log('🚀 You can proceed with deployment.');
}