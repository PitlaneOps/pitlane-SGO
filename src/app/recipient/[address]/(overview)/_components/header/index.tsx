import React, { Suspense } from 'react';

import { Globe, Server } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { Avatar } from '@/components/ui/avatar';

import { OverallRecipientStats, LoadingOverallRecipientStats } from './stats';

import { cn, formatAddress } from '@/lib/utils';

import { api } from '@/trpc/server';
import { Address } from '@/components/ui/address';
import { HeaderButtons, LoadingHeaderButtons } from './buttons';

interface Props {
  address: string;
}

export const HeaderCard: React.FC<Props> = async ({ address }) => {
  const origins = await api.origins.list.origins({
    address,
  });

  return (
    <Card className={cn('relative mt-10 md:mt-12')}>
      <Card className="absolute top-0 left-4 -translate-y-1/2 size-12 md:size-16 flex items-center justify-center border rounded-md overflow-hidden">
        <Avatar
          src={origins.length === 1 ? origins[0].favicon : null}
          className="size-8 border-none rounded-none"
          fallback={
            origins.length === 1 ? (
              <Globe className="size-8" />
            ) : (
              <Server className="size-8" />
            )
          }
        />
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-7">
        <div className="flex flex-col gap-4 p-4 pt-8 md:pt-10 col-span-5">
          <div className="">
            <h1 className="text-3xl font-bold break-words line-clamp-2">
              {origins.length === 0
                ? formatAddress(address)
                : origins.length === 1
                  ? new URL(origins[0].origin).hostname
                  : `${origins.length} servers`}
            </h1>
            <p
              className={cn(
                'break-words line-clamp-2',
                origins.length === 0
                  ? 'text-muted-foreground/60'
                  : 'text-muted-foreground'
              )}
            >
              {origins.length === 0 ? (
                'This address is not associated with any known servers'
              ) : (
                <Address
                  address={address}
                  className="border-none p-0 text-sm"
                  side="bottom"
                />
              )}
            </p>
          </div>
          <HeaderButtons hasOrigins={origins.length > 0} address={address} />
        </div>
        <div className="col-span-2">
          <Suspense fallback={<LoadingOverallRecipientStats />}>
            <OverallRecipientStats address={address} />
          </Suspense>
        </div>
      </div>
    </Card>
  );
};

export const LoadingHeaderCard = () => {
  return (
    <Card className={cn('relative mt-10 md:mt-12 mb-12')}>
      <Card className="absolute top-0 left-4 -translate-y-1/2 size-12 md:size-16 flex items-center justify-center border rounded-md overflow-hidden">
        <Avatar
          src={undefined}
          className="size-full"
          fallback={<Skeleton className="size-8" />}
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-7">
        <div className="flex flex-col gap-4 p-4 pt-8 md:pt-10 col-span-5">
          <div className="">
            <Skeleton className="w-36 h-[30px] my-[3px]" />
            <Skeleton className="w-64 h-[16px] my-[4px]" />
          </div>
          <LoadingHeaderButtons />
        </div>
        <div className="col-span-2 overflow-hidden">
          <LoadingOverallRecipientStats />
        </div>
      </div>
    </Card>
  );
};
