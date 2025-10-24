'use client';

import { DataTable } from '@/components/ui/data-table';

import { useSellersSorting } from '@/app/_contexts/sorting/sellers/hook';
import { useTimeRangeContext } from '@/app/_contexts/time-range/hook';
import { useChain } from '@/app/_contexts/chain/hook';

import { columns } from './columns';
import { api } from '@/trpc/client';

export const KnownSellersTable = () => {
  const { sorting } = useSellersSorting();
  const { startDate, endDate } = useTimeRangeContext();
  const { chain } = useChain();

  const [topSellers] = api.sellers.list.bazaar.useSuspenseQuery({
    chain,
    startDate,
    endDate,
    sorting,
  });

  return <DataTable columns={columns} data={topSellers.items} />;
};

export const LoadingKnownSellersTable = () => {
  return (
    <DataTable columns={columns} data={[]} loadingRowCount={10} isLoading />
  );
};
