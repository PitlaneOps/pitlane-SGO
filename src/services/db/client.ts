import 'server-only';

import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

import { neonConfig } from '@neondatabase/serverless';

import ws from 'ws';

import { env } from '@/env';

neonConfig.webSocketConstructor = ws;

const connectionString = `${env.POSTGRES_PRISMA_URL}`;
const adapter = new PrismaNeon({ connectionString });

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
