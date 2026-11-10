import { verify } from "hono/jwt";
import type { TokenInfo } from "@postr/core";
import { env } from "../config/env.js";

export const normalizeUrl = (url: string | undefined): string => {
	if (url) {
		url = url.trim();
		url = url.toLowerCase();
		url = url.replace(/\/+$/, "");
	}
	return url || "";
};

/** Verifies a token issued by the `/token` endpoint for this site. */
export async function verifyToken(token: string): Promise<TokenInfo | null> {
	try {
		const decoded = (await verify(token, env.TOKEN_SECRET, "HS256")) as {
			me: string;
			client_id?: string;
			scope?: string;
		};
		if (normalizeUrl(decoded.me) !== normalizeUrl(env.NEXT_PUBLIC_URL)) {
			return null;
		}
		return {
			me: env.NEXT_PUBLIC_URL,
			scope: (decoded.scope ?? "").split(/\s+/).filter(Boolean),
			...(decoded.client_id ? { clientId: decoded.client_id } : {}),
		};
	} catch {
		return null;
	}
}

/** True for the permanent `MICROPUB_TOKEN` or a valid token from `/token`. */
export async function isAdminRequest(authorization: string | undefined) {
	const token = authorization?.replace(/^Bearer\s+/i, "").trim();
	if (!token) return false;
	if (token === env.MICROPUB_TOKEN) return true;
	return (await verifyToken(token)) !== null;
}
