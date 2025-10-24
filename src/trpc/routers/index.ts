import { createCallerFactory, createTRPCRouter } from '../trpc';

import { acceptsRouter } from './accepts';
import { facilitatorsRouter } from './facilitators';
import { onrampSessionsRouter } from './onramp-sessions';
import { originsRouter } from './origins';
import { resourcesRouter } from './resources';
import { sellersRouter } from './sellers';
import { statisticsRouter } from './statistics';
import { transfersRouter } from './transfers';

export const appRouter = createTRPCRouter({
  accepts: acceptsRouter,
  stats: statisticsRouter,
  sellers: sellersRouter,
  resources: resourcesRouter,
  origins: originsRouter,
  transfers: transfersRouter,
  facilitators: facilitatorsRouter,
  onrampSessions: onrampSessionsRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
