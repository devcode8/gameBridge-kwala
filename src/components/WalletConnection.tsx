"use client";

import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";

const client = createThirdwebClient({
  clientId: "7bdc8715b38056aa63f50cdb1ef1503d",
});

export default function WalletConnection() {
  const account = useActiveAccount();

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">
        Web3 Wallet Connection
      </h2>
      
      {!account?.address ? (
        <div className="text-center">
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            Connect your wallet to start playing the quiz game
          </p>
          <ConnectButton 
            client={client}
            theme="light"
          />
        </div>
      ) : (
        <div className="text-center">
          <p className="mb-2 text-green-600 dark:text-green-400 font-semibold">
            ✅ Wallet Connected
          </p>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-300 font-mono">
            {account.address.slice(0, 6)}...{account.address.slice(-4)}
          </p>
          <ConnectButton 
            client={client}
            theme="light"
          />
        </div>
      )}
    </div>
  );
}