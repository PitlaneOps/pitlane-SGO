import { Suspense } from 'react';

import { notFound } from 'next/navigation';

import { Body, Heading } from '@/app/_components/layout/page-utils';

import {
  LatestTransactionsTable,
  LoadingLatestTransactionsTable,
} from '../_components/transactions/table';

import { api, HydrateClient } from '@/trpc/server';
import { facilitatorIdMap } from '@/lib/facilitators';
import { subMonths } from 'date-fns';
import { defaultTransfersSorting } from '@/app/_contexts/sorting/transfers/default';
import { ActivityTimeframe } from '@/types/timeframes';
import { firstTransfer } from '@/services/facilitator/constants';
import { TimeRangeProvider } from '@/app/_contexts/time-range/provider';
import { TransfersSortingProvider } from '@/app/_contexts/sorting/transfers/provider';

export default async function TransactionsPage({
  params,
}: PageProps<'/facilitator/[id]/transactions'>) {
  const { id } = await params;

  const facilitator = facilitatorIdMap.get(id);

  if (!facilitator) {
    return notFound();
  }

  const limit = 150;
  const endDate = new Date();
  const startDate = subMonths(endDate, 1);

  await api.transfers.list.prefetch({
    limit,
    facilitators: Object.values(facilitator.addresses).flat(),
    startDate,
    endDate,
    sorting: defaultTransfersSorting,
  });

  return (
    <HydrateClient>
      <Heading
        title="Transactions"
        description="Transactions made through this facilitator"
      />
      <Body>
        <TimeRangeProvider
          initialEndDate={endDate}
          initialStartDate={startDate}
          creationDate={firstTransfer}
          initialTimeframe={ActivityTimeframe.ThirtyDays}
        >
          <TransfersSortingProvider initialSorting={defaultTransfersSorting}>
            <Suspense
              fallback={<LoadingLatestTransactionsTable loadingRowCount={15} />}
            >
              <LatestTransactionsTable
                addresses={Object.values(facilitator.addresses).flat()}
                limit={limit}
                pageSize={15}
              />
            </Suspense>
          </TransfersSortingProvider>
        </TimeRangeProvider>
      </Body>
    </HydrateClient>
  );
}
