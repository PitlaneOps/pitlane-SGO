import { env } from '@/env';

import SiweProvider from './siwe/provider';
import EchoProvider from './echo';

export const providers = [
  ...(env.ECHO_APP_ID
    ? [
        EchoProvider({
          clientId: env.ECHO_APP_ID,
          allowDangerousEmailAccountLinking: true,
        }),
      ]
    : []),
  ...(env.NEXT_PUBLIC_CDP_PROJECT_ID ? [SiweProvider()] : []),
];
