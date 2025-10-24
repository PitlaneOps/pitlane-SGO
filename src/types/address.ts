export type SolanaAddress = string & { readonly __brand: unique symbol };
export type MixedAddress = SolanaAddress;

// Helper function to validate Solana addresses
export const isSolanaAddress = (address: string): address is SolanaAddress => {
  // Basic Solana address validation (base58, 32-44 characters)
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
};

export const createSolanaAddress = (address: string): SolanaAddress => {
  if (!isSolanaAddress(address)) {
    throw new Error('Invalid Solana address format');
  }
  return address as SolanaAddress;
};
