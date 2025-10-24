import { Body, Heading } from '@/app/_components/layout/page-utils';
import { api, HydrateClient } from '@/trpc/server';
import {
  LatestTransactionsTable,
  LoadingLatestTransactionsTable,
} from '../_components/transactions';
import { Suspense } from 'react';
import { subMonths } from 'date-fns';
import { defaultTransfersSorting } from '@/app/_contexts/sorting/transfers/default';
import { TransfersSortingProvider } from '@/app/_contexts/sorting/transfers/provider';
import { firstTransfer } from '@/services/facilitator/constants';
import { ActivityTimeframe } from '@/types/timeframes';
import { TimeRangeProvider } from '@/app/_contexts/time-range/provider';
import { getChain } from '@/app/_lib/chain';

export default async function TransactionsPage({
  searchParams,
}: PageProps<'/transactions'>) {
  const chain = await searchParams.then(params => getChain(params.chain));

  const limit = 150;

  const endDate = new Date();
  const startDate = subMonths(endDate, 1);

  await api.transfers.list.prefetch({
    limit,
    startDate,
    endDate,
    sorting: defaultTransfersSorting,
    chain,
  });

  return (
    <HydrateClient>
      <TransfersSortingProvider initialSorting={defaultTransfersSorting}>
        <TimeRangeProvider
          initialEndDate={endDate}
          initialStartDate={startDate}
          creationDate={firstTransfer}
          initialTimeframe={ActivityTimeframe.ThirtyDays}
        >
          <Heading
            title="Transactions"
            description="All x402 transactions through the Coinbase facilitator"
          />
          <Body>
            <Suspense
              fallback={<LoadingLatestTransactionsTable loadingRowCount={15} />}
            >
              <LatestTransactionsTable limit={limit} pageSize={15} />
            </Suspense>
          </Body>
        </TimeRangeProvider>
      </TransfersSortingProvider>
    </HydrateClient>
  );
}
