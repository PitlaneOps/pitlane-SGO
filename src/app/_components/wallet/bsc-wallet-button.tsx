'use client';

import React, { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export const BSCWalletButton = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [showModal, setShowModal] = useState(false);

  const handleConnect = () => {
    const injectedConnector = connectors[0];
    if (injectedConnector) {
      connect({ connector: injectedConnector });
      setShowModal(false);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <Button
        onClick={() => disconnect()}
        className="!bg-primary !text-primary-foreground hover:!bg-primary/90"
      >
        {formatAddress(address)}
      </Button>
    );
  }

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        className="!bg-primary !text-primary-foreground hover:!bg-primary/90"
      >
        Connect Wallet
      </Button>

      {showModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowModal(false)}
          />
          
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-2xl shadow-2xl border p-6 max-w-sm w-full relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-semibold mb-4">
                Connect Your Wallet
              </h2>
              
              <p className="text-sm text-muted-foreground mb-6">
                Connect with MetaMask or Rabby to access xgrain402 explorer
              </p>

              <button
                onClick={handleConnect}
                className="w-full flex items-center gap-3 p-4 rounded-xl border-2 hover:border-primary hover:bg-accent transition-all"
              >
                <div className="text-left">
                  <p className="font-semibold">MetaMask / Rabby</p>
                  <p className="text-xs text-muted-foreground">Connect to BSC network</p>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

// Backward compatibility alias
export const SolanaWalletButton = BSCWalletButton;

export const ConnectedWalletInfo = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (!isConnected || !address) {
    return null;
  }

  const shortAddress = `${address.slice(0, 4)}...${address.slice(-4)}`;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {shortAddress}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => disconnect()}
      >
        Disconnect
      </Button>
    </div>
  );
};

