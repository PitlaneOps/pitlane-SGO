export type BSCAddress = `0x${string}`;
export type SolanaAddress = BSCAddress; // Backward compatibility
export type MixedAddress = BSCAddress;

// Helper function to validate BSC/EVM addresses
export const isBSCAddress = (address: string): address is BSCAddress => {
  // EVM address validation (0x followed by 40 hex characters)
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// Backward compatibility alias
export const isSolanaAddress = isBSCAddress;

export const createBSCAddress = (address: string): BSCAddress => {
  if (!isBSCAddress(address)) {
    throw new Error('Invalid BSC address format');
  }
  return address as BSCAddress;
};

// Backward compatibility alias
export const createSolanaAddress = createBSCAddress;
