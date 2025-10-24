import z from 'zod';
import { Prisma } from '@prisma/client';

import { baseQuerySchema } from '../lib';

import { mixedAddressSchema } from '@/lib/schemas';
import { queryRaw } from '@/services/db/transfers-client';

export const getFirstTransferTimestampInputSchema = baseQuerySchema.extend({
  addresses: z.array(mixedAddressSchema).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  facilitators: z.array(mixedAddressSchema).optional(),
});

const firstTransferResultSchema = z.array(
  z.object({
    block_timestamp: z.date(),
  })
);

export const getFirstTransferTimestamp = async (
  input: z.infer<typeof getFirstTransferTimestampInputSchema>
): Promise<Date | null> => {
  const { addresses, startDate, endDate, facilitators, chain } = input;

  const sql = Prisma.sql`
    SELECT t.block_timestamp
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
    ORDER BY t.block_timestamp ASC
    LIMIT 1
  `;

  const result = await queryRaw(sql, firstTransferResultSchema);

  return result[0]?.block_timestamp ?? null;
};
