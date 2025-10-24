import { Body, HeadingContainer } from '../../_components/layout/page-utils';

import { SearchButton } from './_components/search-button';
import {
  AllSellers,
  LoadingAllSellers,
} from './_components/sellers/all-sellers';
import { OverallStats } from './_components/stats';
import {
  LoadingTopServers,
  TopServers,
} from './_components/sellers/known-sellers';
import {
  LatestTransactions,
  LoadingLatestTransactions,
} from './_components/latest-transactions';
import { TopFacilitators } from './_components/top-facilitators';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { getChain } from '@/app/_lib/chain';
import { Suspense } from 'react';
import { LoadingTopFacilitators } from './_components/top-facilitators/loading';

export default async function Home({ searchParams }: PageProps<'/'>) {
  const chain = await searchParams.then(params => getChain(params.chain));
  return (
    <div>
      <HeadingContainer className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Logo className="size-8" />
            <h1 className="text-2xl md:text-4xl font-bold font-mono">
              x402scan
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            The x402 analytics dashboard and block explorer
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-2">
          <SearchButton />
          <Link href="/resources/register" className="w-full md:w-fit">
            <Button
              variant="turbo"
              className="shrink-0 w-full md:w-fit px-4"
              size="lg"
            >
              <Plus className="size-4" />
              Register Resource
            </Button>
          </Link>
        </div>
      </HeadingContainer>
      <Body>
        <OverallStats chain={chain} />
        <Suspense fallback={<LoadingTopServers />}>
          <TopServers chain={chain} />
        </Suspense>
        <Suspense fallback={<LoadingTopFacilitators />}>
          <TopFacilitators chain={chain} />
        </Suspense>
        <Suspense fallback={<LoadingLatestTransactions />}>
          <LatestTransactions chain={chain} />
        </Suspense>
        <Suspense fallback={<LoadingAllSellers />}>
          <AllSellers chain={chain} />
        </Suspense>
      </Body>
    </div>
  );
}
