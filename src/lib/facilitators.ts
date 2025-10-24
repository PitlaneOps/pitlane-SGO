import { Chain } from '@/types/chain';

import type { MixedAddress, SolanaAddress } from '@/types/address';
import { mixedAddressSchema } from './schemas';

export type Facilitator = {
  id: string;
  name: string;
  image: string;
  link: string;
  addresses: Partial<Record<Chain, MixedAddress[]>>;
  color: string;
};

const xgrainFacilitator: Facilitator = {
  id: 'xgrain402',
  name: 'XGrain402' as const,
  image: '/xgrain402.png',
  link: 'https://explorer.xgrain402.xyz',
  addresses: {
    [Chain.SOLANA]: ['9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM' as SolanaAddress],
  },
  color: 'var(--color-primary)',
};

const solanaProgramFacilitator: Facilitator = {
  id: 'solana-program',
  name: 'Solana Program' as const,
  image: '/solana.png',
  link: 'https://solana.com',
  addresses: {
    [Chain.SOLANA]: ['So11111111111111111111111111111111111111112' as SolanaAddress],
  },
  color: 'var(--color-orange-600)',
};

const payAiFacilitator: Facilitator = {
  id: 'payai',
  name: 'PayAI' as const,
  image: '/payai.png',
  link: 'https://payai.network',
  addresses: {
    [Chain.SOLANA]: [
      '2wKupLR9q6wXYppw8Gr2NvWxKBUqm4PPJKkQfoxHDBg4' as SolanaAddress,
    ],
  },
  color: 'var(--color-purple-600)',
};

const aurraCloudFacilitator: Facilitator = {
  id: 'aurracloud',
  name: 'AurraCloud' as const,
  image: '/aurracloud.png',
  link: 'https://aurracloud.com',
  addresses: {
    [Chain.SOLANA]: ['AuRRaC1oud7nWzF84cL1JeYuLqBrAg1NBfZGe4GkgPHv' as SolanaAddress],
  },
  color: 'var(--color-yellow-600)',
};

const thirdwebFacilitator: Facilitator = {
  id: 'thirdweb',
  name: 'thirdweb' as const,
  image: '/thirdweb.png',
  link: 'https://portal.thirdweb.com/solana',
  addresses: {
    [Chain.SOLANA]: ['ThrdW3b1111111111111111111111111111111111111' as SolanaAddress],
  },
  color: 'var(--color-pink-600)',
};

const corbitsFacilitator: Facilitator = {
  id: 'corbits',
  name: 'Corbits' as const,
  image: '/corbits.png',
  link: 'https://corbits.dev',
  addresses: {
    [Chain.SOLANA]: [
      'AepWpq3GQwL8CeKMtZyKtKPa7W91Coygh3ropAJapVdU' as SolanaAddress,
    ],
  },
  color: 'var(--color-orange-600)',
};

export const facilitators: Facilitator[] = [
  xgrainFacilitator,
  solanaProgramFacilitator,
  payAiFacilitator,
  aurraCloudFacilitator,
  thirdwebFacilitator,
  corbitsFacilitator,
];

type FacilitatorId = (typeof facilitators)[number]['id'];
export type FacilitatorName = (typeof facilitators)[number]['name'];

export const facilitatorIdMap = new Map<FacilitatorId, Facilitator>(
  facilitators.map(f => [f.id, f])
);

export const facilitatorAddresses = facilitators.flatMap(f =>
  Object.values(f.addresses)
    .flat()
    .map(address => mixedAddressSchema.parse(address))
);

export const facilitatorAddressMap = new Map<MixedAddress, Facilitator>(
  facilitators.flatMap(f =>
    Object.values(f.addresses)
      .flat()
      .map(address => [address, f] as const)
  )
);
