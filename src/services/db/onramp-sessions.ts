import z from 'zod';

import { prisma } from './client';
import type { OnrampSession } from '@prisma/client';

export const createOnrampSessionSchema = z.object({
  token: z.string(),
  amount: z.number(),
  userId: z.string(),
});

export const createOnrampSession = async (
  input: z.input<typeof createOnrampSessionSchema>
) => {
  const { token, amount, userId } = createOnrampSessionSchema.parse(input);

  return prisma.onrampSession.create({
    data: {
      token,
      amount,
      userId,
    },
  });
};

export const getOnrampSessionByToken = async (token: string) => {
  return prisma.onrampSession.findUnique({
    where: {
      token,
    },
  });
};

export const updateOnrampSession = async (
  id: string,
  data: Partial<OnrampSession>
) => {
  return prisma.onrampSession.update({
    where: {
      id,
    },
    data,
  });
};
