'use client';

import React, { useMemo } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { bsc, bscTestnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { injected } from 'wagmi/connectors';

import { env } from '@/env';

// Create QueryClient for react-query
const queryClient = new QueryClient();

interface Props {
  children: React.ReactNode;
}

export const BSCProvider = ({ children }: Props) => {
  // The network can be set to 'testnet' or 'mainnet'
  const network = env.NEXT_PUBLIC_BSC_NETWORK || 'testnet';
  
  const config = useMemo(() => {
    const chains = network === 'mainnet' ? [bsc] : [bscTestnet];
    const rpcUrl = env.NEXT_PUBLIC_BSC_RPC_URL || 
      (network === 'mainnet' 
        ? 'https://bsc-dataseed.binance.org'
        : 'https://data-seed-prebsc-1-s1.binance.org:8545');

    return createConfig({
      chains,
      connectors: [
        injected({
          target: {
            id: 'injected',
            name: 'MetaMask / Rabby',
            provider: (window) => window?.ethereum,
          },
        }),
      ],
      transports: {
        [bsc.id]: http(rpcUrl),
        [bscTestnet.id]: http(rpcUrl),
      },
    });
  }, [network]);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
};

// Backward compatibility alias
export const SolanaProvider = BSCProvider;

