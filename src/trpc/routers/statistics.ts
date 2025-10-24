import {
  getOverallStatistics,
  overallStatisticsInputSchema,
} from '@/services/transfers/stats/overall';
import {
  getBucketedStatistics,
  bucketedStatisticsInputSchema,
} from '@/services/transfers/stats/bucketed';
import {
  getFirstTransferTimestampInputSchema,
  getFirstTransferTimestamp,
} from '@/services/transfers/stats/first-transfer';

import { createTRPCRouter, publicProcedure } from '../trpc';
import { getAcceptsAddresses } from '@/services/db/accepts';
import { mixedAddressSchema } from '@/lib/schemas';

export const statisticsRouter = createTRPCRouter({
  getOverallStatistics: publicProcedure
    .input(overallStatisticsInputSchema)
    .query(async ({ input }) => {
      return await getOverallStatistics(input);
    }),
  getBucketedStatistics: publicProcedure
    .input(bucketedStatisticsInputSchema)
    .query(async ({ input }) => {
      return await getBucketedStatistics(input);
    }),

  getFirstTransferTimestamp: publicProcedure
    .input(getFirstTransferTimestampInputSchema)
    .query(async ({ input }) => {
      return await getFirstTransferTimestamp(input);
    }),

  bazaar: {
    overallStatistics: publicProcedure
      .input(overallStatisticsInputSchema)
      .query(async ({ input }) => {
        const originsByAddress = await getAcceptsAddresses(input.chain);
        return await getOverallStatistics({
          ...input,
          addresses: Object.keys(originsByAddress).map(addr =>
            mixedAddressSchema.parse(addr)
          ),
        });
      }),
    bucketedStatistics: publicProcedure
      .input(bucketedStatisticsInputSchema)
      .query(async ({ input }) => {
        const originsByAddress = await getAcceptsAddresses();
        return await getBucketedStatistics({
          ...input,
          addresses: Object.keys(originsByAddress).map(addr =>
            mixedAddressSchema.parse(addr)
          ),
        });
      }),
  },
});
