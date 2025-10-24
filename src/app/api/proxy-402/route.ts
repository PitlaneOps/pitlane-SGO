import { NextResponse, type NextRequest } from 'next/server';

const TARGET_HEADER = 'x-proxy-target';
const RESPONSE_HEADER_BLOCKLIST = new Set([
  'content-encoding',
  'transfer-encoding',
  'content-length',
]);
const REQUEST_HEADER_BLOCKLIST = new Set([
  'host',
  'content-length',
  TARGET_HEADER,
]);

async function proxy(request: NextRequest) {
  const startTime = Date.now();
  const targetValue = request.headers.get(TARGET_HEADER);

  if (!targetValue) {
    return NextResponse.json(
      { error: 'Missing x-proxy-target header' },
      { status: 400 }
    );
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(targetValue);
  } catch {
    return NextResponse.json(
      { error: 'Invalid x-proxy-target header' },
      { status: 400 }
    );
  }

  const upstreamHeaders = new Headers();
  request.headers.forEach((value, key) => {
    if (!REQUEST_HEADER_BLOCKLIST.has(key.toLowerCase())) {
      upstreamHeaders.set(key, value);
    }
  });

  const method = request.method.toUpperCase();
  let body: ArrayBuffer | undefined;
  let requestBodySize = 0;

  if (method !== 'GET' && method !== 'HEAD') {
    body = await request.arrayBuffer();
    requestBodySize = body.byteLength;
  }

  console.log('[Proxy Request]', {
    method,
    url: targetUrl.toString(),
    requestBodySize,
    timestamp: new Date().toISOString(),
  });

  try {
    const upstreamResponse = await fetch(targetUrl, {
      method,
      headers: upstreamHeaders,
      body,
    });

    const fetchDuration = Date.now() - startTime;
    const contentLength = upstreamResponse.headers.get('content-length');
    const responseBodySize = contentLength ? parseInt(contentLength) : null;

    console.log('[Proxy Response]', {
      method,
      url: targetUrl.toString(),
      status: upstreamResponse.status,
      responseBodySize,
      contentType: upstreamResponse.headers.get('content-type'),
      fetchDuration,
      timestamp: new Date().toISOString(),
    });

    const responseHeaders = new Headers();
    upstreamResponse.headers.forEach((value, key) => {
      if (!RESPONSE_HEADER_BLOCKLIST.has(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    });
    responseHeaders.set(TARGET_HEADER, targetUrl.toString());

    return new NextResponse(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    const errorDuration = Date.now() - startTime;
    console.error('[Proxy Error]', {
      method,
      url: targetUrl.toString(),
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      duration: errorDuration,
      timestamp: new Date().toISOString(),
    });
    const message =
      error instanceof Error ? error.message : 'Unknown upstream error';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function GET(request: NextRequest) {
  return proxy(request);
}

export async function POST(request: NextRequest) {
  return proxy(request);
}

export async function PUT(request: NextRequest) {
  return proxy(request);
}

export async function PATCH(request: NextRequest) {
  return proxy(request);
}

export async function DELETE(request: NextRequest) {
  return proxy(request);
}
