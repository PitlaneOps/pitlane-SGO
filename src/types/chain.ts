export enum Chain {
  BSC = 'bsc',
  // Backward compatibility
  SOLANA = 'bsc',
}

export const SUPPORTED_CHAINS = Object.values([Chain.BSC]);

export const CHAIN_LABELS: Record<Chain, string> = {
  [Chain.BSC]: 'BSC',
  [Chain.SOLANA]: 'BSC', // Backward compatibility
};

export const CHAIN_ICONS: Record<Chain, string> = {
  [Chain.BSC]: '/bsc.png',
  [Chain.SOLANA]: '/bsc.png', // Backward compatibility
};
