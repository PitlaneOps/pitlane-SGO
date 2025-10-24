'use client';

import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  BackpackWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

import { env } from '@/env';

// Import the CSS for wallet adapter UI
require('@solana/wallet-adapter-react-ui/styles.css');

interface Props {
  children: React.ReactNode;
}

export const SolanaProvider = ({ children }: Props) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = env.NEXT_PUBLIC_SOLANA_NETWORK;
  
  // You can provide a custom RPC endpoint
  const endpoint = useMemo(() => {
    if (env.NEXT_PUBLIC_SOLANA_RPC_URL) {
      return env.NEXT_PUBLIC_SOLANA_RPC_URL;
    }
    return clusterApiUrl(network);
  }, [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new BackpackWalletAdapter(),
      new TorusWalletAdapter(),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
