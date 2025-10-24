'use client';

import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';

export const SolanaWalletButton = () => {
  return (
    <WalletMultiButton
      className="!bg-primary !text-primary-foreground hover:!bg-primary/90 !border-0 !rounded-md !px-3 !py-2 !text-sm !font-medium !transition-colors focus:!outline-none focus:!ring-2 focus:!ring-ring focus:!ring-offset-2 disabled:!opacity-50 disabled:!pointer-events-none"
    />
  );
};

export const ConnectedWalletInfo = () => {
  const { publicKey, connected, disconnect } = useWallet();

  if (!connected || !publicKey) {
    return null;
  }

  const addressStr = publicKey.toString();
  const shortAddress = `${addressStr.slice(0, 4)}...${addressStr.slice(-4)}`;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {shortAddress}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={disconnect}
      >
        Disconnect
      </Button>
    </div>
  );
};
