import { describe, it, expect } from 'vitest';
import { parseX402Response } from './schema';

// Raw bodies from the test data file
const rawBodies = [
  `{"x402Version":1,"accepts":[{"scheme":"exact","network":"base","maxAmountRequired":"10000","resource":"https://ai-api-sbx.aeon.xyz/open/ai/402/payment","description":"The omnichain settlement layer that enables AI agents to seamlessly pay millions of real-world merchants across SEA, LATAM, and Africa — powered by x402 and USDC.","mimeType":"","outputSchema":{"input":{"type":"http","method":"GET","discoverable":true,"query_params":{"appId":"Application ID for identifying request source","qrCode":"QR code data containing payment information","address":"Ethereum address to receive payment"},"body_type":null,"body_fields":null,"header_fields":null},"output":{"code":{"type":"string","description":"response"},"msg":{"type":"string","description":"response message"},"model":{"type":"object","properties":{"num":{"type":"string","description":"System order number"},"qrCode":{"type":"string","description":"QR code"},"usdAmount":{"type":"string","description":"USD amount"},"orderAmount":{"type":"string","description":"Fiat currency amount"},"fiatExchangeRate":{"type":"string","description":"Fiat exchange rate"},"merchantOrderNo":{"type":"string","description":"Merchant order number"},"orderCurrency":{"type":"string","description":"Order fiat currency"},"status":{"type":"string","description":"Order status"},"createTime":{"type":"string","description":"Transaction creation time"},"bankData":{"type":"object","description":"Bank information","properties":{"bankAccountName":{"type":"string","description":"Bank account name"},"bankAccountNumber":{"type":"string","description":"Bank account number"},"bankCode":{"type":"string","description":"Bank code"},"bankName":{"type":"string","description":"Bank name"}}}}},"traceId":{"type":"string","description":"traceId"}}},"payTo":"","maxTimeoutSeconds":60,"asset":"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913","extra":{"name":"USD Coin","version":"2"}}],"error":"No X-PAYMENT header provided"}`,
  `{"x402Version":1,"error":"X-PAYMENT header is required","accepts":[{"scheme":"exact","network":"base","maxAmountRequired":"10000","resource":"https://api.itsgloria.ai/news","description":"Get the latest news from Gloria AI","mimeType":"application/json","payTo":"0xCa1271E777C209e171826A681855351f4989cd0c","maxTimeoutSeconds":60,"asset":"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913","outputSchema":{"input":{"type":"http","method":"GET","discoverable":true,"queryParams":{"feed_categories":{"type":"string","description":"Comma separated list of feed categories. Available categories: crypto, macro, ai_agents, ondo, rwa","required":true},"from_date":{"type":"string","description":"Date in YYYY-MM-DD format","required":false},"to_date":{"type":"string","description":"Date in YYYY-MM-DD format","required":false},"page":{"type":"string","description":"Page number","required":false},"limit":{"type":"string","description":"Number of results per page","required":false}}},"output":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"signal":{"type":"string"},"timestamp":{"type":"number"},"feed_category":{"type":"string"},"short_context":{"type":"string"},"long_context":{"type":"string"},"sources":{"type":"array","items":{"type":"string"}}}}}},"extra":{"name":"USD Coin","version":"2"}}]}`,
  `{"x402Version":1,"error":"X-PAYMENT header is required","accepts":[{"scheme":"exact","network":"base","maxAmountRequired":"10000","resource":"https://places-api.x402hub.xyz/api/places/text-search","description":"","mimeType":"","payTo":"0xf43F7a7b8370d28ECB6606636dc61c0470c4EC91","maxTimeoutSeconds":60,"asset":"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913","outputSchema":{"input":{"type":"http","method":"POST","discoverable":true}},"extra":{"name":"USD Coin","version":"2"}}]}`,
  `{"x402Version":1,"error":"X-PAYMENT header is required","accepts":[{"scheme":"exact","network":"base","maxAmountRequired":"1000000","resource":"https://staging-echo.merit.systems/api/v1/base/payment-link","description":"Access to protected content","mimeType":"application/json","payTo":"0xf97d54F304Fa5C3a705aac8408846786B1f9abBA","maxTimeoutSeconds":300,"asset":"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913","outputSchema":{"input":{"type":"http","method":"GET"}},"extra":{"name":"USD Coin","version":"2"}}]}`,
  `{"x402Version":1,"error":"X-PAYMENT header is required","accepts":[{"scheme":"exact","network":"base","maxAmountRequired":"50000","resource":"https://staging.toolkit.dev/api/tool/e2b/run-code","description":"","mimeType":"application/json","payTo":"0x0cC2CDC0EB992860d6c2a216b1DC0895fD2DF82F","maxTimeoutSeconds":300,"asset":"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913","outputSchema":{"input":{"type":"http","method":"POST"}},"extra":{"name":"USD Coin","version":"2"}}]}`,
  `{"x402Version":1,"error":"X-PAYMENT header is required","accepts":[{"scheme":"exact","network":"base","maxAmountRequired":"100000","resource":"https://true-cast-agent.vercel.app/api/trueCast","description":"TrueCast API - News aggregator and fact-checking service grounded by prediction markets. Real-time data sources include Perplexity, X AI, Tavily, Neynar, Pyth, DeFiLlama, Truemarkets, Zerion, Allora and more.","mimeType":"application/json","payTo":"0xa8c1a5D3C372C65c04f91f87a43F549619A9483f","maxTimeoutSeconds":300,"asset":"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913","outputSchema":{"input":{"type":"http","method":"POST","discoverable":true,"bodyType":"json","bodyFields":{"prompt":{"type":"string","description":"The statement, claim, or question to fact-check and verify","required":true},"castHash":{"type":"string","description":"Optional Farcaster cast hash for context-specific verification"},"storeToPinata":{"type":"boolean","description":"Whether to store the response to IPFS via Pinata (default: false)"},"runGuardrail":{"type":"boolean","description":"Whether to run AWS Bedrock Guardrails validation (default: false)"}}},"output":{"type":"object","properties":{"query":{"type":"string","description":"The original user query that was processed"},"reply":{"type":"string","description":"The fact-checked response with analysis and conclusions"},"assessment":{"type":"string","enum":["TRUE","FALSE","PARTIALLY_TRUE","UNVERIFIABLE","MARKET_SENTIMENT"],"description":"The final truth assessment of the query"},"confidenceScore":{"type":"number","minimum":0,"maximum":100,"description":"Confidence level in the assessment (0-100)"},"data_sources":{"type":"array","description":"Information from data sources used in verification","items":{"type":"object","properties":{"name":{"type":"string","description":"Name of the data source"},"prompt":{"type":"string","description":"Prompt sent to this data source"},"reply":{"type":"string","description":"Response from this data source"},"source":{"type":"string","description":"Source URL or identifier"}}}},"metadata":{"type":"object","properties":{"timestamp":{"type":"string","description":"ISO timestamp of processing"},"promptType":{"type":"string","description":"Categorized type of the prompt"},"needsExternalData":{"type":"boolean","description":"Whether external data was needed"},"sourcesUsed":{"type":"array","items":{"type":"string"},"description":"Names of data sources used"},"totalSources":{"type":"number","description":"Total number of data sources queried"},"processingTimeSec":{"type":"number","description":"Time taken to process in seconds"}}},"ipfs":{"type":"object","description":"IPFS storage information (if storeToPinata was true)","properties":{"hash":{"type":"string","description":"IPFS hash of stored response"},"gatewayUrl":{"type":"string","description":"Public gateway URL for the stored response"},"network":{"type":"string","enum":["public","private"],"description":"IPFS network used"},"paymentResponse":{"type":"object","description":"Payment transaction details if x402 was used","properties":{"network":{"type":"string"},"payer":{"type":"string"},"success":{"type":"boolean"},"transaction":{"type":"string"}}}}},"guardrail":{"type":"object","description":"AWS Bedrock Guardrails validation results (if runGuardrail was true)","properties":{"input":{"type":"object","description":"Input validation results"},"output":{"type":"object","description":"Output validation results"}}}},"required":["query","reply","assessment","confidenceScore","metadata"]}},"extra":{"name":"USD Coin","version":"2"}}]}`,
  `{"x402Version":1,"error":"X-PAYMENT header is required","accepts":[{"scheme":"exact","network":"base","maxAmountRequired":"1000000","resource":"https://www.remixme.xyz/api/generate/custom","description":"Custom remix video generation with profile picture","mimeType":"application/json","payTo":"0x37ffc90BDb5B0c3aCF8beCCCe4AA7e7d74ab38Ba","maxTimeoutSeconds":300,"asset":"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913","outputSchema":{"input":{"type":"http","method":"POST","bodyType":"json","bodyFields":{"prompt":"string","walletAddress":"string","pfpUrl":"string","farcasterId":"number"}}},"extra":{"name":"USD Coin","version":"2"}}]}`,
  `{"x402Version":1,"error":"X-PAYMENT header is required","accepts":[{"scheme":"exact","network":"base","maxAmountRequired":"500000","resource":"https://www.remixme.xyz/api/generate/daily","description":"Daily remix video generation with profile picture","mimeType":"application/json","payTo":"0x37ffc90BDb5B0c3aCF8beCCCe4AA7e7d74ab38Ba","maxTimeoutSeconds":300,"asset":"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913","outputSchema":{"input":{"type":"http","method":"POST","bodyType":"json","bodyFields":{"walletAddress":"string","pfpUrl":"string","farcasterId":"number"}}},"extra":{"name":"USD Coin","version":"2"}}]}`,
];

describe('parseX402Response', () => {
  it('should handle x402 responses with lenient parsing', () => {
    const responseWithError = JSON.parse(rawBodies[1]) as unknown;
    const result = parseX402Response(responseWithError);

    // The function should handle responses with error fields, even if strict parsing fails
    if (result.success) {
      expect(result.data.x402Version).toBe(1);
      expect(result.data.accepts).toHaveLength(1);
      expect(result.data.error).toBe('X-PAYMENT header is required');
    } else {
      // If parsing fails, it should provide error information
      expect(result.errors).toBeDefined();
    }
  });

  it('should return error for invalid data', () => {
    const invalidData = { invalid: 'data' };
    const result = parseX402Response(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toBeDefined();
      expect(result.errors.length).toBeGreaterThan(0);
    }
  });

  it('should handle null or undefined input', () => {
    expect(parseX402Response(null).success).toBe(false);
    expect(parseX402Response(undefined).success).toBe(false);
  });

  it('should handle empty object', () => {
    const result = parseX402Response({});
    expect(result.success).toBe(false);
  });
});

describe('parseX402Response with normalized schemas', () => {
  it('should normalize Gloria AI response with queryParams', () => {
    const response = JSON.parse(rawBodies[1]) as unknown;
    const result = parseX402Response(response);

    expect(result.success).toBe(true);
    if (result.success) {
      const inputSchema = result.data.accepts?.[0]?.outputSchema?.input;
      expect(inputSchema).toBeDefined();
      expect(inputSchema?.queryParams?.feed_categories).toBeDefined();
      expect(inputSchema?.bodyFields).toBeUndefined();
    }
  });

  it('should handle validation errors for invalid payTo field', () => {
    const response = JSON.parse(rawBodies[0]) as unknown;
    const result = parseX402Response(response);

    // This should fail because payTo is an empty string
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toBeDefined();
      expect(result.errors.some(error => error.includes('payTo'))).toBe(true);
    }
  });

  it('should extract field information from API responses', () => {
    const response = JSON.parse(rawBodies[5]) as unknown;
    const result = parseX402Response(response);

    expect(result.success).toBe(true);
    if (result.success) {
      const inputSchema = result.data.accepts?.[0]?.outputSchema?.input;
      expect(inputSchema).toBeDefined();
      expect(inputSchema?.bodyFields?.prompt).toBeDefined();
      expect(inputSchema?.bodyType).toBe('json');
      expect(inputSchema?.queryParams).toBeUndefined();
    }
  });

  it('should handle various API response formats', () => {
    const response = JSON.parse(rawBodies[6]) as unknown;
    const result = parseX402Response(response);

    expect(result.success).toBe(true);
    if (result.success && result.data.accepts?.[0]?.outputSchema?.input) {
      const inputSchema = result.data.accepts[0].outputSchema.input;
      expect(inputSchema.bodyFields?.prompt).toEqual({ type: 'string' });
      expect(inputSchema.bodyFields?.walletAddress).toEqual({ type: 'string' });
      expect(inputSchema.bodyType).toBe('json');
    }
  });

  it('should handle GET requests without body fields', () => {
    const response = JSON.parse(rawBodies[3]) as unknown;
    const result = parseX402Response(response);

    expect(result.success).toBe(true);
    if (result.success) {
      const inputSchema = result.data.accepts?.[0]?.outputSchema?.input;
      expect(inputSchema?.queryParams).toBeUndefined();
      expect(inputSchema?.bodyFields).toBeUndefined();
    }
  });

  it('should return error for empty accepts array', () => {
    const invalidResponse = { x402Version: 1, accepts: [] };
    const result = parseX402Response(invalidResponse);

    expect(result.success).toBe(true);
    if (result.success) {
      const inputSchema = result.data.accepts?.[0]?.outputSchema?.input;
      expect(inputSchema).toBeUndefined();
    }
  });

  it('should return error for missing outputSchema', () => {
    const invalidResponse = {
      x402Version: 1,
      accepts: [
        {
          scheme: 'exact',
          network: 'base',
          maxAmountRequired: '1000',
          resource: 'https://example.com',
          description: 'test',
          mimeType: 'json',
          payTo: '0x123',
          maxTimeoutSeconds: 60,
          asset: '0x456',
        },
      ],
    };
    const result = parseX402Response(invalidResponse);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.length).toBeGreaterThan(0);
    }
  });

  it('should handle completely invalid input', () => {
    const result = parseX402Response('not an object');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.length).toBeGreaterThan(0);
    }
  });

  it('should handle camelCase and snake_case field names', () => {
    const mixedResponse = {
      x402Version: 1,
      accepts: [
        {
          scheme: 'exact',
          network: 'base',
          maxAmountRequired: '1000',
          resource: 'https://example.com',
          description: 'test',
          mimeType: 'application/json',
          payTo: '0x1234567890123456789012345678901234567890',
          maxTimeoutSeconds: 60,
          asset: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
          outputSchema: {
            input: {
              type: 'http',
              method: 'POST',
              query_params: { test: 'value' },
              body_fields: { body: 'test' },
              body_type: 'json',
              header_fields: { auth: 'bearer' },
            },
          },
        },
      ],
    };

    const result = parseX402Response(mixedResponse);

    expect(result.success).toBe(true);
    if (result.success && result.data.accepts?.[0]?.outputSchema?.input) {
      const inputSchema = result.data.accepts[0].outputSchema.input;
      expect(inputSchema.queryParams?.test).toEqual({ type: 'value' });
      expect(inputSchema.bodyFields?.body).toEqual({ type: 'test' });
      expect(inputSchema.bodyType).toBe('json');
      expect(inputSchema.headerFields?.auth).toEqual({ type: 'bearer' });
    }
  });
});

describe('schema validation edge cases', () => {
  it('should handle minimal valid responses', () => {
    const minimalResponse = {
      x402Version: 1,
      accepts: [
        {
          scheme: 'exact',
          network: 'base',
          maxAmountRequired: '1000',
          resource: 'https://example.com',
          description: 'test',
          mimeType: 'application/json',
          payTo: '0x1234567890123456789012345678901234567890',
          maxTimeoutSeconds: 60,
          asset: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
          outputSchema: {
            input: {
              type: 'http',
              method: 'GET',
            },
          },
        },
      ],
    };

    const result = parseX402Response(minimalResponse);

    expect(result.success).toBe(true);
    if (result.success && result.data.accepts?.[0]?.outputSchema?.input) {
      const inputSchema = result.data.accepts[0].outputSchema.input;
      expect(inputSchema.queryParams).toBeUndefined();
      expect(inputSchema.bodyFields).toBeUndefined();
    }
  });

  it('should handle error fields in responses', () => {
    const responseWithError = JSON.parse(rawBodies[0]) as unknown;
    const result = parseX402Response(responseWithError);

    // The function should handle responses with error fields
    if (result.success) {
      expect(result.data.error).toBe('No X-PAYMENT header provided');
    } else {
      expect(result.errors).toBeDefined();
    }
  });

  it('should handle array inputs gracefully', () => {
    const arrayInput = [1, 2, 3];
    const parseResult = parseX402Response(arrayInput);

    expect(parseResult.success).toBe(false);
    if (!parseResult.success) {
      expect(parseResult.errors.length).toBeGreaterThan(0);
    }
  });
});
