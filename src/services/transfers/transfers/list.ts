import z from 'zod';

import { mixedAddressSchema } from '@/lib/schemas';
import { toPaginatedResponse } from '@/lib/pagination';
import { baseQuerySchema, sortingSchema } from '../lib';
import {
  createCachedPaginatedQuery,
  createStandardCacheKey,
} from '@/lib/cache';
import { transfersPrisma } from '@/services/db/transfers-client';
import type { MixedAddress } from '@/types/address';
import type { Chain } from '@/types/chain';

const listFacilitatorTransfersSortIds = ['block_timestamp', 'amount'] as const;

export type TransfersSortId = (typeof listFacilitatorTransfersSortIds)[number];

export const listFacilitatorTransfersInputSchema = baseQuerySchema.extend({
  recipient: mixedAddressSchema.optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  limit: z.number().default(100),
  sorting: sortingSchema(listFacilitatorTransfersSortIds).default({
    id: 'block_timestamp',
    desc: true,
  }),
  facilitators: z.array(mixedAddressSchema).optional(),
});

const listFacilitatorTransfersUncached = async (
  input: z.infer<typeof listFacilitatorTransfersInputSchema>
) => {
  const { recipient, startDate, endDate, limit, facilitators, sorting, chain } =
    input;

  // Build the where clause for Prisma
  const where = {
    // Filter by chain
    chain: chain,
    // Filter by facilitator addresses
    ...(facilitators ? { transaction_from: { in: facilitators } } : {}),
    // Optional recipient filter
    ...(recipient ? { recipient } : {}),
    // Date range filters
    ...(startDate && endDate
      ? { block_timestamp: { gte: startDate, lte: endDate } }
      : {}),
    ...(startDate && !endDate ? { block_timestamp: { gte: startDate } } : {}),
    ...(!startDate && endDate ? { block_timestamp: { lte: endDate } } : {}),
  };

  // Fetch transfers from Neon database
  const transfers = await transfersPrisma.transferEvent.findMany({
    where,
    orderBy: {
      [sorting.id]: sorting.desc ? 'desc' : 'asc',
    },
    take: limit + 1,
  });

  // Map to expected output format
  const items = transfers.map(transfer => ({
    sender: transfer.sender as MixedAddress,
    recipient: transfer.recipient as MixedAddress,
    amount: transfer.amount,
    token_address: transfer.address as MixedAddress,
    transaction_from: transfer.transaction_from as MixedAddress,
    transaction_hash: transfer.tx_hash,
    block_timestamp: transfer.block_timestamp,
    chain: transfer.chain as Chain,
  }));

  return toPaginatedResponse({
    items,
    limit,
  });
};

export const listFacilitatorTransfers = createCachedPaginatedQuery({
  queryFn: listFacilitatorTransfersUncached,
  cacheKeyPrefix: 'transfers-list',
  createCacheKey: input => createStandardCacheKey(input),
  dateFields: ['block_timestamp'],

  tags: ['transfers'],
});
