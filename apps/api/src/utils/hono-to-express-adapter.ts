import type { Request, Response, NextFunction } from "express";
import type { Hono } from "hono";

/**
 * Adapter to convert Hono routes to Express middleware
 */
export function adaptHonoToExpress(
	honoApp: Hono,
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			// Create a Request object compatible with Hono
			const contentType = req.headers["content-type"] || "";
			let body: string | undefined;

			if (req.method !== "GET" && req.method !== "HEAD") {
				if (contentType.includes("application/x-www-form-urlencoded")) {
					// For form data, send as URLSearchParams
					const params = new URLSearchParams();
					Object.entries(req.body || {}).forEach(([key, value]) => {
						params.append(key, String(value));
					});
					body = params.toString();
				} else {
					// For JSON, stringify the body
					body = JSON.stringify(req.body);
				}
			}

			const honoRequest = new Request(`http://localhost:4000${req.url}`, {
				method: req.method,
				headers: req.headers as any,
				body,
			});

			// Execute the Hono app
			const response = await honoApp.fetch(honoRequest);

			// Convert Hono response to Express response
			res.status(response.status);

			// Copy headers
			response.headers.forEach((value, key) => {
				res.set(key, value);
			});

			// Send response body
			// Check if response is binary (image, pdf, etc.)
			const responseContentType = response.headers.get("content-type") || "";
			if (
				responseContentType.startsWith("image/") ||
				responseContentType.startsWith("application/pdf") ||
				responseContentType.startsWith("application/octet-stream")
			) {
				// For binary content, convert to buffer
				const arrayBuffer = await response.arrayBuffer();
				res.send(Buffer.from(arrayBuffer));
			} else {
				// For text content, use text()
				const responseText = await response.text();
				res.send(responseText);
			}
		} catch (error) {
			console.error("Error in Hono-to-Express adapter:", error);
			next(error);
		}
	};
}
