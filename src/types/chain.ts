export enum Chain {
  SOLANA = 'solana',
}

export const SUPPORTED_CHAINS = Object.values([Chain.SOLANA]);

export const CHAIN_LABELS: Record<Chain, string> = {
  [Chain.SOLANA]: 'Solana',
};

export const CHAIN_ICONS: Record<Chain, string> = {
  [Chain.SOLANA]: '/solana.png',
};
