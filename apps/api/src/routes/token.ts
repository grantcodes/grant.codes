import { parse, stringify } from "node:querystring";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { sign, verify } from "hono/jwt";
import { env } from "../config/env.js";

const app = new Hono();

// Apply CORS middleware
app.use("*", cors());
app.options("*", cors());

const normalizeUrl = (url: string | undefined): string => {
	if (url) {
		url = url.trim();
		url = url.toLowerCase();
		url = url.replace(/\/+$/, "");
	}
	return url || "";
};

interface TokenRequest {
	action?: string;
	client_id?: string;
	code?: string;
	code_verifier?: string;
	grant_type?: string;
	redirect_uri?: string;
	refresh_token?: string;
	token?: string;
}

interface TokenData {
	me: string;
	client_id: string;
	scope: string;
	date_issued: Date;
}

interface TokenResponse {
	me: string;
	scope: string;
	access_token: string;
	token_type: string;
}

app.post("/", async (c) => {
	try {
		const body = (await c.req.parseBody()) as TokenRequest;
		const {
			action,
			client_id,
			code,
			code_verifier,
			grant_type,
			redirect_uri,
			refresh_token,
			// token: _token, // unused
		} = body;

		// Can't have both action and grant_type
		if (action && grant_type) {
			return c.json(
				{ error: "Cannot specify both action and grant_type" },
				400,
			);
		}

		if (action) {
			if (action === "revoke") {
				// Could revoke token here
			}
			return c.json({ error: "Invalid action" }, 400);
		}

		if (grant_type) {
			switch (grant_type) {
				case "authorization_code": {
					if (!code) {
						return c.json({ error: "Missing code" }, 400);
					}

					if (!client_id) {
						return c.json({ error: "Missing client_id" }, 400);
					}

					if (!redirect_uri) {
						return c.json({ error: "Missing redirect_uri" }, 400);
					}

					const requestBody = stringify({
						code,
						redirect_uri,
						client_id,
						code_verifier,
					});

					const response = await fetch("https://indieauth.com/auth", {
						method: "POST",
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
						},
						body: requestBody,
					});

					if (!response.ok) {
						const errorBody = await response.text();
						console.warn(
							"IndieAuth request failed:",
							response.status,
							response.statusText,
							errorBody,
						);
						return c.json({ error: "IndieAuth verification failed" }, 400);
					}

					const responseText = await response.text();

					let responseData: Record<string, string | string[] | undefined>;

					// Try to parse as JSON first, then fall back to form data
					try {
						responseData = JSON.parse(responseText);
					} catch (jsonError) {
						// If JSON parsing fails, try form data parsing
						responseData = parse(responseText) as Record<
							string,
							string | string[] | undefined
						>;
					}

					const meRaw = Array.isArray(responseData.me)
						? responseData.me[0]
						: responseData.me;
					const errorRaw = Array.isArray(responseData.error)
						? responseData.error[0]
						: responseData.error;
					const currentUrl = process.env.NEXT_PUBLIC_URL || env.NEXT_PUBLIC_URL;

					// Check if meRaw is undefined or empty
					if (!meRaw) {
						console.warn('IndieAuth response missing "me" field');
						return c.json(
							{ error: "Invalid response from IndieAuth - missing 'me' field" },
							400,
						);
					}

					if (normalizeUrl(meRaw) !== normalizeUrl(currentUrl) || errorRaw) {
						console.warn(
							responseData?.error ??
								`Me does not match: ${meRaw} !== ${currentUrl}`,
							errorRaw,
						);
						return c.json({ error: "Invalid response from IndieAuth" }, 400);
					}

					const meValue = Array.isArray(responseData.me)
						? responseData.me[0]
						: responseData.me;
					const scopeValue = Array.isArray(responseData.scope)
						? responseData.scope.join(" ")
						: (responseData.scope ?? "");

					const tokenData: TokenData = {
						me: normalizeUrl(meValue),
						client_id,
						scope: scopeValue,
						date_issued: new Date(),
					};

					const payload = {
						...tokenData,
						exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365, // 1 year from now
					};

					const access_token = await sign(payload, env.TOKEN_SECRET, 'HS256');

					const tokenResponse: TokenResponse = {
						me: normalizeUrl(meValue),
						scope: scopeValue,
						access_token: access_token,
						token_type: "Bearer",
					};

					const acceptHeader = c.req.header("accept");
					if (acceptHeader && acceptHeader.indexOf("application/json") > -1) {
						return c.json(tokenResponse);
					}

					// Build x-www-form-urlencoded body ensuring spaces encoded as '+'
					const params = new URLSearchParams();
					params.set("me", tokenResponse.me);
					params.set("scope", tokenResponse.scope);
					params.set("access_token", tokenResponse.access_token);
					params.set("token_type", tokenResponse.token_type);
					return new Response(params.toString(), {
						headers: { "Content-Type": "application/x-www-form-urlencoded" },
					});
				}

				case "refresh_token": {
					// Do something with refresh token
					if (!refresh_token) {
						return c.json({ error: "Missing refresh_token" }, 400);
					}

					// No support for refresh tokens yet
					return c.json({ error: "Refresh tokens not supported" }, 400);
				}
				default: {
					return c.json({ error: "Invalid grant_type" }, 400);
				}
			}
		}

		// Something went wrong
		return c.json({ error: "Internal server error" }, 500);
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		console.error("Error with getting token", message);
		if (c) {
			return c.json({ error: "Bad request" }, 400);
		}
		// Fallback if context is not available
		return new Response(JSON.stringify({ error: "Bad request" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}
});

app.get("/", async (c) => {
	try {
		const authHeader = c.req.header("authorization");
		if (authHeader) {
			const token = authHeader.replace("Bearer ", "");

			try {
				const tokenSecret =
					env?.TOKEN_SECRET || process.env.TOKEN_SECRET || "fallback-secret";
			const decoded = (await verify(token, tokenSecret, 'HS256')) as {
				me: string;
				client_id: string;
				scope: string;
			};

				const publicUrl = process.env.NEXT_PUBLIC_URL || env.NEXT_PUBLIC_URL;
				if (normalizeUrl(decoded.me) === normalizeUrl(publicUrl)) {
					// All good :)
					const response = {
						me: normalizeUrl(decoded.me),
						client_id: decoded.client_id,
						scope: decoded.scope,
					};

					const acceptHeader = c.req.header("accept");
					if (acceptHeader && acceptHeader.indexOf("application/json") > -1) {
						return c.json(response);
					} else {
						const params = new URLSearchParams();
						params.set("me", response.me);
						params.set("client_id", response.client_id);
						params.set("scope", response.scope);
						return new Response(params.toString(), {
							headers: { "Content-Type": "application/x-www-form-urlencoded" },
						});
					}
				} else {
					return c.json({ error: "Invalid token" }, 401);
				}
			} catch (err) {
				console.error("Error verifying token", token, err);
				return c.json({ error: "Invalid token" }, 401);
			}
		} else {
			return c.json({ error: "Missing authorization header" }, 401);
		}
	} catch (err) {
		console.error("Error verifying token", err);
		if (c) {
			return c.json({ error: "Internal server error" }, 401);
		}
		// Fallback if context is not available
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 401,
			headers: { "Content-Type": "application/json" },
		});
	}
});

export { app as tokenRouter };
