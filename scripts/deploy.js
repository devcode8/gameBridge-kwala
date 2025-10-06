const { ThirdwebSDK } = require("@thirdweb-dev/sdk");
const { Sepolia } = require("@thirdweb-dev/chains");
require('dotenv').config();

async function deployContract() {
  try {
    // Initialize the SDK with your secret key
    const sdk = new ThirdwebSDK(Sepolia, {
      secretKey: "kVWWTYU71EEaBfKCCLp8HbGf2KKx95_Tpb6P3HxjevkHsghKBzXwCBDgROviJloCvbxHAVJG9D0K9C6YRSUfWQ"
    });

    console.log("🚀 Deploying QuizProgress contract...");

    // Deploy the contract
    const contractAddress = await sdk.deployer.deployContract({
      name: "QuizProgress",
      primary_sale_recipient: sdk.wallet.getAddress(),
      voting_delay_in_blocks: 0,
      voting_period_in_blocks: 6570, // ~1 day
      voting_token_address: "0x0000000000000000000000000000000000000000",
      voting_quorum_fraction: 4,
      proposal_token_threshold: 1,
    });

    console.log("✅ Contract deployed successfully!");
    console.log("📍 Contract address:", contractAddress);
    console.log("🔗 View on Sepolia Etherscan:", `https://sepolia.etherscan.io/address/${contractAddress}`);

    return contractAddress;
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    throw error;
  }
}

// Run the deployment
if (require.main === module) {
  deployContract()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { deployContract };