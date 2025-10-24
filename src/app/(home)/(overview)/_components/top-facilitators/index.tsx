import { api, HydrateClient } from '@/trpc/server';
import { Suspense } from 'react';
import { TopFacilitatorsContent } from './content';
import { LoadingTopFacilitators } from './loading';
import { facilitatorAddresses, facilitators } from '@/lib/facilitators';
import type { Chain } from '@/types/chain';

interface Props {
  chain?: Chain;
}

export const TopFacilitators: React.FC<Props> = async ({ chain }: Props) => {
  // Get facilitators for the default chain
  const chainFacilitators = chain
    ? facilitators.flatMap(f => f.addresses[chain] ?? [])
    : facilitatorAddresses;

  // Prefetch all data including chart data for each facilitator
  await Promise.all([
    api.stats.getOverallStatistics.prefetch({ chain }),
    api.facilitators.list.prefetch({ chain, limit: 3 }),
    ...chainFacilitators.map(address =>
      api.stats.getBucketedStatistics.prefetch({
        numBuckets: 48,
        facilitators: [address],
      })
    ),
  ]);

  return (
    <HydrateClient>
      <Suspense fallback={<LoadingTopFacilitators />}>
        <TopFacilitatorsContent />
      </Suspense>
    </HydrateClient>
  );
};
