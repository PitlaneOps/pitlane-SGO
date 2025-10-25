'use client';

import { Wallet } from 'lucide-react';

import { useAccount } from 'wagmi';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { useBSCBalance } from '@/app/_hooks/use-bsc-balance';

import { BSCWalletButton } from '../../wallet/bsc-wallet-button';

export const NavbarAuthButton = () => {
  const { address, isConnected } = useAccount();

  return (
    <>
      {isConnected && address ? (
        <ConnectedButton />
      ) : (
        <BSCWalletButton />
      )}
    </>
  );
};

const ConnectedButton = ({ onClick }: { onClick?: () => void }) => {
  const { address } = useAccount();
  const { balance, isLoading } = useBSCBalance(address);

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
            maximumFractionDigits: 4,
            notation: 'compact',
          }
        )} BNB`}</span>
      )}
    </Button>
  );
};
