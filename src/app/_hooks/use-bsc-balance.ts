'use client';

import { useAccount, useBalance } from 'wagmi';
import { useEffect, useState } from 'react';
import { formatEther } from 'viem';

export const useBSCBalance = (address?: `0x${string}`) => {
  const { address: connectedAddress } = useAccount();
  const targetAddress = address || connectedAddress;
  
  const { data, isError, isLoading, refetch } = useBalance({
    address: targetAddress,
  });

  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      const bnbBalance = parseFloat(formatEther(data.value));
      setBalance(bnbBalance);
      setError(null);
    } else if (isError) {
      setError('Failed to fetch balance');
      setBalance(null);
    }
  }, [data, isError]);

  return {
    balance,
    isLoading,
    error,
    refetch: () => refetch(),
  };
};

// Backward compatibility alias
export const useSolanaBalance = useBSCBalance;

