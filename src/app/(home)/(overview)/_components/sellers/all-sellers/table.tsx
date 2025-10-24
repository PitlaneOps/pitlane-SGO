'use client';

import { api } from '@/trpc/client';

import { DataTable } from '@/components/ui/data-table';

import { columns } from './columns';
import { useSellersSorting } from '../../../../../_contexts/sorting/sellers/hook';
import { useTimeRangeContext } from '@/app/_contexts/time-range/hook';
import { useChain } from '@/app/_contexts/chain/hook';

export const AllSellersTable = () => {
  const { sorting } = useSellersSorting();
  const { startDate, endDate } = useTimeRangeContext();
  const { chain } = useChain();

  const [topSellers] = api.sellers.list.all.useSuspenseQuery({
    chain,
    sorting,
    limit: 100,
    startDate,
    endDate,
  });

  return (
    <DataTable
      columns={columns}
      data={topSellers.items}
      href={data => `/recipient/${data.recipient}`}
    />
  );
};
