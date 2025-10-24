import z from 'zod';

import { TRPCError } from '@trpc/server';

import { createTRPCRouter, protectedProcedure } from '@/trpc/trpc';

import { getOnrampTransactions } from '@/services/cdp/onramp/get-onramp-session';
import {
  createOnrampSession,
  getOnrampSessionByToken,
  updateOnrampSession,
} from '@/services/db/onramp-sessions';
import {
  createOnrampUrl,
  createOnrampUrlParamsSchema,
} from '@/services/cdp/onramp/create-onramp-session';

import { SessionStatus } from '@prisma/client';

export const onrampSessionsRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input: { id } }) => {
      const onrampSession = await getOnrampSessionByToken(id);

      if (!onrampSession) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      if (
        onrampSession.status ===
          SessionStatus.ONRAMP_TRANSACTION_STATUS_SUCCESS ||
        onrampSession.status === SessionStatus.ONRAMP_TRANSACTION_STATUS_FAILED
      ) {
        return onrampSession;
      }

      const { transactions } = await getOnrampTransactions(id);

      const transaction = transactions[0];

      if (!transaction) {
        return onrampSession;
      }

      return await updateOnrampSession(onrampSession.id, {
        status: transaction.status,
        txHash: transaction.tx_hash,
        failureReason:
          transaction.status === SessionStatus.ONRAMP_TRANSACTION_STATUS_FAILED
            ? transaction.failure_reason
            : null,
      });
    }),

  create: protectedProcedure
    .input(createOnrampUrlParamsSchema)
    .mutation(async ({ ctx, input }) => {
      const { token, url } = await createOnrampUrl(ctx.session.user.id, input);
      await createOnrampSession({
        token,
        amount: input.amount,
        userId: ctx.session.user.id,
      });
      return url;
    }),
});
