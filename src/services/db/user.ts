import type { Prisma } from '@prisma/client';
import { prisma } from './client';

export const getEchoAccountByUserId = async (userId: string) => {
  const account = await prisma.account.findFirst({
    where: {
      userId,
      provider: 'echo',
    },
  });
  return account;
};

export const updateEchoAccountByUserId = async (
  echoAccountId: string,
  data: Prisma.AccountUpdateInput
) => {
  await prisma.account.update({
    where: {
      provider_providerAccountId: {
        provider: 'echo',
        providerAccountId: echoAccountId,
      },
    },
    data,
  });
};
