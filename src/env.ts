import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    POSTGRES_PRISMA_URL: z.url(),
    POSTGRES_URL_NON_POOLING: z.url(),
    TRANSFERS_DB_URL: z.url(),
    SOLANA_RPC_URL: z.url().default('https://api.mainnet-beta.solana.com'),
    SOLANA_PRIVATE_KEY: z.string().optional(),
    ECHO_APP_ID: z.string().optional(),
    HIDE_TRPC_LOGS: z.coerce.boolean().optional(),
    GITHUB_TOKEN: z.string().optional(),
    CRON_SECRET:
      process.env.NEXT_PUBLIC_NODE_ENV === 'development'
        ? z.string().optional()
        : z.string(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.url().default('https://explorer.xgrain402.xyz'),
    NEXT_PUBLIC_NODE_ENV: z
      .enum(['development', 'production'])
      .default('development'),
    NEXT_PUBLIC_SOLANA_NETWORK: z.enum(['mainnet-beta', 'devnet', 'testnet']).default('mainnet-beta'),
    NEXT_PUBLIC_SOLANA_RPC_URL: z.url().optional(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().optional(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://explorer.xgrain402.xyz'),
    NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV ?? 'development',
    NEXT_PUBLIC_SOLANA_NETWORK: process.env.NEXT_PUBLIC_SOLANA_NETWORK ?? 'mainnet-beta',
    NEXT_PUBLIC_SOLANA_RPC_URL: process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  },
  emptyStringAsUndefined: true,
});
