'use client';

import { Wallet } from 'lucide-react';

import { useWallet } from '@solana/wallet-adapter-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { useSolanaBalance } from '@/app/_hooks/use-solana-balance';

import { SolanaWalletButton } from '../../wallet/solana-wallet-button';

export const NavbarAuthButton = () => {
  const { publicKey, connected } = useWallet();

  return (
    <>
      {connected && publicKey ? (
        <ConnectedButton />
      ) : (
        <SolanaWalletButton />
      )}
    </>
  );
};

const ConnectedButton = ({ onClick }: { onClick?: () => void }) => {
  const { publicKey } = useWallet();
  const { balance, isLoading } = useSolanaBalance(publicKey?.toString());

  return (
    <Button size="navbar" variant="outline" onClick={onClick}>
      <Wallet className="size-4" />
      {isLoading ? (
        <Skeleton className="h-4 w-20 hidden md:block" />
      ) : (
        <span className="hidden md:block">{`${(balance ?? 0).toLocaleString(
          undefined,
          {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
            notation: 'compact',
          }
        )} SOL`}</span>
      )}
    </Button>
  );
};
