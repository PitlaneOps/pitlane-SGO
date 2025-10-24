import { NextResponse } from 'next/server';
import { subMonths, differenceInSeconds, subSeconds } from 'date-fns';
import { api } from '@/trpc/server';
import { defaultSellersSorting } from '@/app/_contexts/sorting/sellers/default';
import { defaultTransfersSorting } from '@/app/_contexts/sorting/transfers/default';

import type { NextRequest } from 'next/server';
import { checkCronSecret } from '@/lib/cron';

export async function GET(request: NextRequest) {
  const cronCheck = checkCronSecret(request);
  if (cronCheck) {
    return cronCheck;
  }

  try {
    const endDate = new Date();
    const startDate = subMonths(endDate, 1);
    const limit = 100;

    // Warm all homepage caches in parallel - using the same tRPC calls as the homepage
    await Promise.all([
      // Overall Stats - current period
      api.stats.getOverallStatistics({
        startDate,
        endDate,
      }),

      // Overall Stats - previous period (for comparison)
      api.stats.getOverallStatistics({
        startDate: subSeconds(
          startDate,
          differenceInSeconds(endDate, startDate)
        ),
        endDate: startDate,
      }),

      // Bucketed Statistics - for charts
      api.stats.getBucketedStatistics({
        startDate,
        endDate,
        numBuckets: 32,
      }),

      // Top Facilitators - all time, no date filters
      api.facilitators.list({}),

      // Top Servers (Bazaar) - list
      api.sellers.list.bazaar({
        startDate,
        endDate,
        sorting: defaultSellersSorting,
      }),

      // Top Servers (Bazaar) - overall stats
      api.stats.bazaar.overallStatistics({
        startDate,
        endDate,
      }),

      // Latest Transactions
      api.transfers.list({
        limit,
        sorting: defaultTransfersSorting,
        startDate,
        endDate,
      }),

      // All Sellers
      api.sellers.list.all({
        startDate,
        endDate,
        sorting: defaultSellersSorting,
      }),
    ]);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      message: 'Cache warmed successfully',
    });
  } catch (error) {
    console.error('Error warming cache:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
