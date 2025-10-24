'use client';

import { api } from '@/trpc/client';

import { DataTable } from '@/components/ui/data-table';

import { columns } from './columns';
import { useFacilitatorsSorting } from '@/app/_contexts/sorting/facilitators/hook';
import { useTimeRangeContext } from '@/app/_contexts/time-range/hook';
import { facilitators } from '@/lib/facilitators';
import { useChain } from '@/app/_contexts/chain/hook';

export const FacilitatorsTable: React.FC = () => {
  const { sorting } = useFacilitatorsSorting();
  const { startDate, endDate } = useTimeRangeContext();
  const { chain } = useChain();

  const [facilitators] = api.facilitators.list.useSuspenseQuery({
    sorting,
    startDate,
    endDate,
    chain,
  });

  return (
    <DataTable
      columns={columns}
      data={facilitators}
      pageSize={facilitators.length}
    />
  );
};

export const LoadingFacilitatorsTable = () => {
  return (
    <DataTable
      columns={columns}
      data={[]}
      isLoading
      loadingRowCount={facilitators.length}
    />
  );
};
