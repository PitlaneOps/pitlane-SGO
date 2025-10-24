import { createTRPCRouter, publicProcedure } from '../trpc';

import { listAccepts } from '@/services/db/accepts';

export const acceptsRouter = createTRPCRouter({
  list: publicProcedure.query(async () => {
    return await listAccepts();
  }),
});
