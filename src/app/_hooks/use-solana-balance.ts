'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useEffect, useState } from 'react';

export const useSolanaBalance = (address?: string) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!address && !publicKey) {
        setBalance(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const pubKey = address ? new PublicKey(address) : publicKey!;
        const lamports = await connection.getBalance(pubKey);
        const solBalance = lamports / LAMPORTS_PER_SOL;
        setBalance(solBalance);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch balance');
        setBalance(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [connection, address, publicKey]);

  return {
    balance,
    isLoading,
    error,
    refetch: () => {
      if (address || publicKey) {
        // Re-trigger useEffect
        setBalance(null);
      }
    },
  };
};
