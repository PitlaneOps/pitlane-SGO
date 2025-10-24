import { chainSchema } from '@/lib/schemas';
import z from 'zod';

export const baseQuerySchema = z.object({
  chain: chainSchema.optional(),
});

export const sortingSchema = (sortIds: string[] | readonly string[]) =>
  z.object({
    id: z.enum(sortIds),
    desc: z.boolean(),
  });
