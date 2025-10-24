'use client';

import { api } from '@/trpc/client';
import { useChain } from '@/app/_contexts/chain/hook';
import { Section } from '../utils';
import { FacilitatorCard } from './_components/card';
import type { ChartData } from '@/components/ui/charts/chart/types';
import type { RouterOutputs } from '@/trpc/client';
import { cn } from '@/lib/utils';

export const TopFacilitatorsContent = () => {
  const { chain } = useChain();

  const [overallStats] = api.stats.getOverallStatistics.useSuspenseQuery({
    chain,
  });

  const [facilitatorsData] = api.facilitators.list.useSuspenseQuery({
    chain,
    limit: 3,
  });

  return (
    <Section
      title="Top Facilitators"
      description="Analytics on facilitators processing x402 transfers"
      className="gap-4"
      href="/facilitators"
    >
      <div
        className={cn(
          `grid grid-cols-1 gap-4`,
          facilitatorsData.length < 2 ? 'md:grid-cols-1' : 'md:grid-cols-2',
          facilitatorsData.length < 3 ? 'md:grid-cols-2' : 'md:grid-cols-3'
        )}
      >
        {facilitatorsData.map(stats => (
          <FacilitatorCardWithChart
            key={stats.facilitator.id}
            stats={stats}
            overallStats={overallStats}
          />
        ))}
      </div>
    </Section>
  );
};

interface FacilitatorCardWithChartProps {
  stats: NonNullable<RouterOutputs['facilitators']['list']>[number];
  overallStats: NonNullable<RouterOutputs['stats']['getOverallStatistics']>;
}

const FacilitatorCardWithChart: React.FC<FacilitatorCardWithChartProps> = ({
  stats,
  overallStats,
}) => {
  const { chain } = useChain();

  const [bucketedStats] = api.stats.getBucketedStatistics.useSuspenseQuery({
    chain,
    numBuckets: 48,
    facilitators: chain
      ? stats.facilitator.addresses[chain]
      : Object.values(stats.facilitator.addresses).flat(),
  });

  const chartData: ChartData<{
    total_transactions: number;
  }>[] = bucketedStats.map(stat => ({
    timestamp: stat.bucket_start.toISOString(),
    total_transactions: Number(stat.total_transactions),
  }));

  return (
    <FacilitatorCard
      facilitator={stats.facilitator}
      stats={stats}
      overallStats={overallStats}
      chartData={chartData}
    />
  );
};
