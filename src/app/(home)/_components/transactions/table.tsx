'use client';

import { api } from '@/trpc/client';

import { DataTable } from '@/components/ui/data-table';

import { columns } from './columns';
import { useTransfersSorting } from '@/app/_contexts/sorting/transfers/hook';
import { useTimeRangeContext } from '@/app/_contexts/time-range/hook';
import { useChain } from '@/app/_contexts/chain/hook';

interface Props {
  limit: number;
  pageSize?: number;
}

export const Table: React.FC<Props> = ({ limit, pageSize }) => {
  const { sorting } = useTransfersSorting();
  const { startDate, endDate } = useTimeRangeContext();
  const { chain } = useChain();

  const [latestTransactions] = api.transfers.list.useSuspenseQuery({
    chain,
    limit,
    sorting,
    startDate,
    endDate,
  });

  return (
    <DataTable
      columns={columns}
      data={latestTransactions.items}
      pageSize={pageSize}
    />
  );
};
