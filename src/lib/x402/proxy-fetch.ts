export const PROXY_ENDPOINT = '/api/proxy-402' as const;
const TARGET_HEADER = 'x-proxy-target' as const;

export const createFetchWithProxyHeader = (targetUrl: string) => {
  return async (input: RequestInfo | URL, requestInit?: RequestInit) => {
    const headers = new Headers(requestInit?.headers);
    headers.set(TARGET_HEADER, targetUrl);

    const { method = 'GET', ...restInit } = requestInit ?? {};
    const normalizedMethod = method.toString().toUpperCase();

    // Auto-add Content-Type for requests with body
    if (
      normalizedMethod !== 'GET' &&
      normalizedMethod !== 'HEAD' &&
      restInit.body
    ) {
      headers.set('Content-Type', 'application/json');
    }

    // Clear body for GET/HEAD requests
    const finalInit: RequestInit = {
      ...restInit,
      method: normalizedMethod,
      headers,
    };

    if (normalizedMethod === 'GET' || normalizedMethod === 'HEAD') {
      finalInit.body = undefined;
    }

    return fetch(input, finalInit);
  };
};
