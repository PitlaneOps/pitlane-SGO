'use client';

import Link from 'next/link';

import { Plus, ServerOff } from 'lucide-react';

import { ResourceExecutor } from './executor';

import { getBazaarMethod } from './executor/utils';

import { api } from '@/trpc/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import {
  LoadingOriginCard,
  OriginCard,
} from '@/app/_components/resources/origin';

import { useChain } from '@/app/_contexts/chain/hook';
import { useState } from 'react';

interface Props {
  emptyText: string;
  defaultOpenOrigins?: string[];
  address?: string;
}

export const ResourcesByOrigin: React.FC<Props> = ({
  emptyText,
  defaultOpenOrigins = [],
  address,
}) => {
  const { chain } = useChain();

  const [originsWithResources] =
    api.origins.list.withResources.useSuspenseQuery({ chain, address });

  const [openOrigins, setOpenOrigins] = useState<string[]>(defaultOpenOrigins);

  if (originsWithResources.length === 0) {
    return (
      <Card>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ServerOff />
            </EmptyMedia>
            <EmptyTitle>No Resources</EmptyTitle>
            <EmptyDescription>{emptyText}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link href="/resources/register">
              <Button variant="turbo">
                <Plus className="size-4" />
                Register Resource
              </Button>
            </Link>
          </EmptyContent>
        </Empty>
      </Card>
    );
  }

  return (
    <Accordion
      type="multiple"
      value={openOrigins}
      onValueChange={setOpenOrigins}
    >
      {originsWithResources.map((origin, index) => (
        <AccordionItem value={origin.id} key={origin.id} className="border-b-0">
          <AccordionTrigger asChild>
            <OriginCard
              origin={origin}
              numResources={origin.resources.length}
            />
          </AccordionTrigger>
          <AccordionContent className="pb-0">
            <div className="pl-4">
              <Accordion type="multiple" className="border-b-0">
                {origin.resources.map(resource => (
                  <AccordionItem
                    value={resource.id}
                    key={resource.id}
                    className="border-b-0 pl-4 border-l pt-4 relative"
                  >
                    <div className="absolute left-0 top-[calc(2rem+5px)] w-4 h-[1px] bg-border" />
                    <ResourceExecutor
                      resource={resource}
                      bazaarMethod={getBazaarMethod(
                        resource.accepts[0].outputSchema
                      )}
                      className="bg-transparent"
                      response={resource.data}
                    />
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </AccordionContent>
          <div className="pl-4">
            <div className="h-4 w-[1px] bg-border" />
            {index === originsWithResources.length - 1 && (
              <div className="size-3 bg-border rounded-full -ml-[5px]" />
            )}
          </div>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

interface LoadingResourcesByOriginProps {
  loadingRowCount?: number;
}

export const LoadingResourcesByOrigin: React.FC<
  LoadingResourcesByOriginProps
> = ({ loadingRowCount = 2 }) => {
  return (
    <div>
      {Array.from({ length: loadingRowCount }).map((_, index) => (
        <div key={index}>
          <LoadingOriginCard />
          <div className="pl-4">
            <div className="h-4 w-[1px] bg-border" />
            {index === loadingRowCount - 1 && (
              <div className="size-3 bg-border rounded-full -ml-[5px]" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
