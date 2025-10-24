import {
  listTopFacilitators,
  listTopFacilitatorsInputSchema,
} from '@/services/transfers/facilitators/list';
import { createTRPCRouter, publicProcedure } from '../trpc';
import {
  bucketedStatisticsInputSchema,
  getBucketedFacilitatorsStatistics,
} from '@/services/transfers/facilitators/bucketed';

export const facilitatorsRouter = createTRPCRouter({
  list: publicProcedure
    .input(listTopFacilitatorsInputSchema)
    .query(async ({ input }) => {
      return await listTopFacilitators(input);
    }),

  bucketedStatistics: publicProcedure
    .input(bucketedStatisticsInputSchema)
    .query(async ({ input }) => {
      return await getBucketedFacilitatorsStatistics(input);
    }),
});
