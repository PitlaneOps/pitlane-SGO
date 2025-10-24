import { createTRPCRouter, publicProcedure } from '../trpc';
import {
  listFacilitatorTransfersInputSchema,
  listFacilitatorTransfers,
} from '@/services/transfers/transfers/list';

export const transfersRouter = createTRPCRouter({
  list: publicProcedure
    .input(listFacilitatorTransfersInputSchema)
    .query(async ({ input }) => {
      return await listFacilitatorTransfers(input);
    }),
});
