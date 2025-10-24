import z from 'zod';
import { Prisma } from '@prisma/client';

import { mixedAddressSchema } from '@/lib/schemas';
import { baseQuerySchema } from '../lib';
import { createCachedQuery, createStandardCacheKey } from '@/lib/cache';
import { queryRaw } from '@/services/db/transfers-client';

export const overallStatisticsInputSchema = baseQuerySchema.extend({
  addresses: z.array(mixedAddressSchema).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  facilitators: z.array(mixedAddressSchema).optional(),
});

const overallStatisticsResultSchema = z.array(
  z.object({
    total_transactions: z.number(),
    total_amount: z.number(),
    unique_buyers: z.number(),
    unique_sellers: z.number(),
    latest_block_timestamp: z.date().nullable(),
  })
);

const getOverallStatisticsUncached = async (
  input: z.infer<typeof overallStatisticsInputSchema>
) => {
  const { addresses, startDate, endDate, facilitators, chain } = input;

  const sql = Prisma.sql`
    SELECT 
      COUNT(*)::int AS total_transactions,
      COALESCE(SUM(t.amount), 0)::float AS total_amount,
      COUNT(DISTINCT t.sender)::int AS unique_buyers,
      COUNT(DISTINCT t.recipient)::int AS unique_sellers,
      MAX(t.block_timestamp) AS latest_block_timestamp
    FROM "TransferEvent" t
    WHERE 1=1
      ${chain ? Prisma.sql`AND t.chain = ${chain}` : Prisma.empty}
      ${facilitators ? Prisma.sql`AND t.transaction_from = ANY(${facilitators}::text[])` : Prisma.empty}
      ${
        addresses && addresses.length > 0
          ? Prisma.sql`AND t.recipient = ANY(${addresses}::text[])`
          : Prisma.empty
      }
      ${startDate ? Prisma.sql`AND t.block_timestamp >= ${startDate}` : Prisma.empty}
      ${endDate ? Prisma.sql`AND t.block_timestamp <= ${endDate}` : Prisma.empty}
  `;

  const result = await queryRaw(sql, overallStatisticsResultSchema);

  const {
    total_transactions = 0,
    total_amount = 0,
    unique_buyers = 0,
    unique_sellers = 0,
    latest_block_timestamp = new Date(),
  } = result[0] ?? {};

  return {
    total_transactions,
    total_amount: Number(total_amount),
    unique_buyers,
    unique_sellers,
    latest_block_timestamp,
  };
};

export const getOverallStatistics = createCachedQuery({
  queryFn: getOverallStatisticsUncached,
  cacheKeyPrefix: 'overall-statistics',
  createCacheKey: input => createStandardCacheKey(input),
  dateFields: ['latest_block_timestamp'],

  tags: ['statistics'],
});
