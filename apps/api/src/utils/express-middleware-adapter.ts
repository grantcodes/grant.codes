import type { MiddlewareHandler } from "hono";

// Types for Express-style middleware
interface ExpressRequest {
  method: string;
  url: string;
  path: string;
  query: Record<string, string>;
  headers: Record<string, string>;
  body?: unknown;
  params: Record<string, string>;
  get: (name: string) => string | undefined;
}

interface ExpressResponse {
  status: (code: number) => ExpressResponse;
  json: (body: unknown) => ExpressResponse;
  send: (body: unknown) => ExpressResponse;
  end: (body?: unknown) => ExpressResponse;
  set: (name: string, value: string) => ExpressResponse;
  get: (name: string) => string | null;
  _responseSent?: boolean;
}

type ExpressMiddleware = (
  req: ExpressRequest,
  res: ExpressResponse,
  next: (err?: Error) => void
) => void;

/**
 * Adapts Express middleware to work with Hono
 * 
 * This utility function creates a wrapper that translates between Express's
 * (req, res, next) signature and Hono's (c, next) signature.
 * 
 * @param expressMiddleware - The Express middleware function
 * @returns A Hono-compatible middleware function
 */
export function adaptExpressMiddleware(
  expressMiddleware: ExpressMiddleware
): MiddlewareHandler {
  return async (c, next) => {
    // Create mock Express request object
    const req = {
      method: c.req.method,
      url: c.req.url,
      path: new URL(c.req.url).pathname,
      query: Object.fromEntries(new URL(c.req.url).searchParams),
      headers: Object.fromEntries(c.req.raw.headers),
      body: undefined, // Will be populated if needed
      params: {}, // Route parameters (if any)
      get: (name: string) => c.req.header(name),
      // Add other commonly used Express req properties as needed
    };

    // Create mock Express response object
    const res: ExpressResponse = {
      status: (code: number) => {
        c.status(code as any);
        return res;
      },
      json: (body: unknown) => {
        res._responseSent = true;
        c.json(body);
        return res;
      },
      send: (body: unknown) => {
        res._responseSent = true;
        c.text(typeof body === 'string' ? body : JSON.stringify(body));
        return res;
      },
      end: (body?: unknown) => {
        res._responseSent = true;
        if (body) {
          c.text(typeof body === 'string' ? body : JSON.stringify(body));
        } else {
          c.text('');
        }
        return res;
      },
      set: (name: string, value: string) => {
        c.header(name, value);
        return res;
      },
      get: (name: string) => c.res.headers.get(name),
      _responseSent: false,
      // Add other commonly used Express res properties as needed
    };

    // Wrap the Express middleware in a Promise to handle async behavior
    await new Promise<void>((resolve, reject) => {
      try {
        expressMiddleware(req, res, (err?: Error) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } catch (error) {
        reject(error);
      }
    });

    // Only continue to the next middleware/handler if response wasn't sent
    if (!res._responseSent) {
      await next();
    }
  };
}
