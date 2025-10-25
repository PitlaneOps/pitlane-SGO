import { Chain } from '@/types/chain';

import type { MixedAddress, BSCAddress } from '@/types/address';
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
    [Chain.BSC]: ['0x9W7DXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAW' as BSCAddress],
  },
  color: 'var(--color-primary)',
};

const bscProgramFacilitator: Facilitator = {
  id: 'bsc-program',
  name: 'BSC Program' as const,
  image: '/bsc.png',
  link: 'https://www.bnbchain.org',
  addresses: {
    [Chain.BSC]: ['0x0000000000000000000000000000000000000000' as BSCAddress],
  },
  color: 'var(--color-orange-600)',
};

const payAiFacilitator: Facilitator = {
  id: 'payai',
  name: 'PayAI' as const,
  image: '/payai.png',
  link: 'https://payai.network',
  addresses: {
    [Chain.BSC]: [
      '0x2wKupLR9q6wXYppw8Gr2NvWxKBUqm4PPJKkQfoxHDB' as BSCAddress,
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
    [Chain.BSC]: ['0xAuRRaC1oud7nWzF84cL1JeYuLqBrAg1NBfZGe4GkgP' as BSCAddress],
  },
  color: 'var(--color-yellow-600)',
};

const thirdwebFacilitator: Facilitator = {
  id: 'thirdweb',
  name: 'thirdweb' as const,
  image: '/thirdweb.png',
  link: 'https://portal.thirdweb.com/',
  addresses: {
    [Chain.BSC]: ['0xThrdW3b1111111111111111111111111111111111' as BSCAddress],
  },
  color: 'var(--color-pink-600)',
};

const corbitsFacilitator: Facilitator = {
  id: 'corbits',
  name: 'Corbits' as const,
  image: '/corbits.png',
  link: 'https://corbits.dev',
  addresses: {
    [Chain.BSC]: [
      '0xAepWpq3GQwL8CeKMtZyKtKPa7W91Coygh3ropAJapV' as BSCAddress,
    ],
  },
  color: 'var(--color-orange-600)',
};

export const facilitators: Facilitator[] = [
  xgrainFacilitator,
  bscProgramFacilitator,
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
