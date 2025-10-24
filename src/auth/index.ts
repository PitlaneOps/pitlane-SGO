import { cache } from 'react';

import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';

import { prisma } from '../services/db/client';
import { providers } from './providers';

import type { DefaultSession } from 'next-auth';
import type { Role } from '@prisma/client';
import {
  getEchoAccountByUserId,
  updateEchoAccountByUserId,
} from '@/services/db/user';
import { addSeconds, getUnixTime } from 'date-fns';

import { v4 as uuid } from 'uuid';
import { encode as defaultEncode } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: Role;
    } & DefaultSession['user'];
  }

  interface User {
    id?: string;
    email?: string | null;
  }
}

const { handlers, auth: uncachedAuth } = NextAuth({
  providers,
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  callbacks: {
    session: async ({ session, user }) => {
      if (!user.id) {
        return session;
      }

      // Handle Echo token refresh
      const account = await getEchoAccountByUserId(user.id);
      if (account?.expires_at && account.expires_at * 1000 < Date.now()) {
        // If the access token has expired, try to refresh it
        try {
          const response = await fetch(
            'https://staging-echo.merit.systems/api/oauth/token',
            {
              method: 'POST',
              body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: account.refresh_token ?? '',
              }),
            }
          );

          const tokensOrError = (await response.json()) as unknown;

          if (!response.ok) throw tokensOrError;

          const newTokens = tokensOrError as {
            access_token: string;
            expires_in: number;
            refresh_token: string;
          };

          await updateEchoAccountByUserId(account.providerAccountId, {
            access_token: newTokens.access_token,
            expires_at: getUnixTime(
              addSeconds(new Date(), newTokens.expires_in)
            ),
            refresh_token: newTokens.refresh_token,
          });
        } catch (error) {
          console.error('Error refreshing access_token', error);
        }
      }

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
      };
    },
    async jwt({ token, account }) {
      if (account?.provider === 'siwe-csrf') {
        token.credentials = true;
      }
      return token;
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid();

        if (!params.token.sub) {
          throw new Error('No user ID found in token');
        }

        const createdSession = await prisma.session.create({
          data: {
            sessionToken: sessionToken.toString(),
            userId: params.token.sub,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          },
        });

        if (!createdSession) {
          throw new Error('Failed to create session');
        }

        return sessionToken;
      }
      return defaultEncode(params);
    },
  },
});

const auth = cache(uncachedAuth);

export { handlers, auth };
