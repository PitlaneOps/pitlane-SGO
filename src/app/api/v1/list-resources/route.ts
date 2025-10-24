import { listOriginsWithResources } from '@/services/db/origin';
import { NextResponse } from 'next/server';
import superjson from 'superjson';

export async function GET() {
  const origins = await listOriginsWithResources({});
  const serialized = superjson.stringify(origins);

  return new NextResponse(serialized, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
