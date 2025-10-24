import z from 'zod';
import { Prisma } from '@prisma/client';

import { chainSchema, mixedAddressSchema } from '@/lib/schemas';
import { toPaginatedResponse } from '@/lib/pagination';

import type { infiniteQuerySchema } from '@/lib/pagination';
import { baseQuerySchema, sortingSchema } from '../lib';
import {
  createCachedPaginatedQuery,
  createStandardCacheKey,
} from '@/lib/cache';
import { queryRaw } from '@/services/db/transfers-client';

const sellerSortIds = [
  'tx_count',
  'total_amount',
  'latest_block_timestamp',
  'unique_buyers',
] as const;

export type SellerSortId = (typeof sellerSortIds)[number];

export const listTopSellersInputSchema = baseQuerySchema.extend({
  sorting: sortingSchema(sellerSortIds),
  addresses: z.array(mixedAddressSchema).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  facilitators: z.array(mixedAddressSchema).optional(),
});

const listTopSellersUncached = async (
  input: z.infer<typeof listTopSellersInputSchema>,
  pagination: z.infer<ReturnType<typeof infiniteQuerySchema<bigint>>>
) => {
  const { sorting, addresses, startDate, endDate, facilitators, chain } = input;
  const { limit } = pagination;

  const orderByMap: Record<SellerSortId, string> = {
    tx_count: 'tx_count',
    total_amount: 'total_amount',
    latest_block_timestamp: 'latest_block_timestamp',
    unique_buyers: 'unique_buyers',
  };
  const orderByField = orderByMap[sorting.id as SellerSortId];
  const orderDirection = sorting.desc ? 'DESC' : 'ASC';

  const sql = Prisma.sql`
    SELECT 
      recipient,
      ARRAY_AGG(DISTINCT transaction_from) as facilitators,
      COUNT(*)::bigint as tx_count,
      SUM(amount)::bigint as total_amount,
      MAX(block_timestamp) as latest_block_timestamp,
      COUNT(DISTINCT sender)::bigint as unique_buyers,
      ARRAY_AGG(DISTINCT chain) as chains
    FROM "TransferEvent"
    WHERE 1=1
      ${chain ? Prisma.sql`AND chain = ${chain}` : Prisma.empty}
      ${facilitators ? Prisma.sql`AND transaction_from = ANY(${facilitators})` : Prisma.empty}
      ${addresses ? Prisma.sql`AND recipient = ANY(${addresses})` : Prisma.empty}
      ${startDate ? Prisma.sql`AND block_timestamp >= ${startDate}` : Prisma.empty}
      ${endDate ? Prisma.sql`AND block_timestamp <= ${endDate}` : Prisma.empty}
    GROUP BY recipient
    ORDER BY ${Prisma.raw(orderByField)} ${Prisma.raw(orderDirection)}
    LIMIT ${limit + 1}
  `;

  const rawResults = await queryRaw(
    sql,
    z.array(
      z.object({
        recipient: mixedAddressSchema,
        facilitators: z.array(mixedAddressSchema),
        tx_count: z.bigint(),
        total_amount: z.bigint(),
        latest_block_timestamp: z.date(),
        unique_buyers: z.bigint(),
        chains: z.array(chainSchema),
      })
    )
  );

  const formattedResults = rawResults.map(row => ({
    ...row,
    tx_count: Number(row.tx_count),
    total_amount: Number(row.total_amount),
    latest_block_timestamp: row.latest_block_timestamp,
    unique_buyers: Number(row.unique_buyers),
  }));

  return toPaginatedResponse({
    items: formattedResults,
    limit,
  });
};

const _listTopSellersCached = createCachedPaginatedQuery({
  queryFn: ({
    input,
    pagination,
  }: {
    input: z.infer<typeof listTopSellersInputSchema>;
    pagination: z.infer<ReturnType<typeof infiniteQuerySchema<bigint>>>;
  }) => listTopSellersUncached(input, pagination),
  cacheKeyPrefix: 'sellers-list',
  createCacheKey: ({ input, pagination }) =>
    createStandardCacheKey({ ...input, limit: pagination.limit }),
  dateFields: ['latest_block_timestamp'],

  tags: ['sellers'],
});

export const listTopSellers = async (
  input: z.infer<typeof listTopSellersInputSchema>,
  pagination: z.infer<ReturnType<typeof infiniteQuerySchema<bigint>>>
) => _listTopSellersCached({ input, pagination });
