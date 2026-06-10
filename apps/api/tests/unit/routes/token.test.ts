import { describe, it, before } from "node:test";
import assert from "node:assert/strict";
import { Hono } from "hono";
import { tokenRouter as tokenEndpoint } from "../../../src/routes/token.js";
import { sign, verify } from "hono/jwt";

// Set up test environment
before(() => {
	process.env.NODE_ENV = "test";
	process.env.NEXT_PUBLIC_URL = "http://localhost:3000";
	process.env.TOKEN_SECRET = "test-secret";
});

describe("Token Route", () => {
	let app: Hono;

	before(() => {
		app = new Hono();
		app.route("/", tokenEndpoint);
	});

	it("should handle authorization code grant type successfully", async () => {
		const originalFetch = global.fetch;
		global.fetch = async (url: string | URL | Request, init?: RequestInit) => {
			if (url === "https://indieauth.com/auth" && init?.method === "POST") {
				return new Response("me=http://localhost:3000&scope=create+update", {
					status: 200,
					headers: { "content-type": "application/x-www-form-urlencoded" },
				});
			}
			return new Response("Not Found", { status: 404 });
		};

		try {
			const req = new Request("http://localhost/", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					Accept: "application/json",
				},
				body: "grant_type=authorization_code&code=valid-code&client_id=test-client&redirect_uri=http://localhost:3000/callback&code_verifier=verifier",
			});

			const res = await app.fetch(req);
			assert.strictEqual(res.status, 200);

			const data = await res.json();
			assert.ok(data.access_token);
			assert.strictEqual(data.token_type, "Bearer");
			assert.strictEqual(data.me, "http://localhost:3000");
			assert.strictEqual(data.scope, "create update");

		// Verify the token is valid
		const decoded = (await verify(
			data.access_token,
			process.env.TOKEN_SECRET!,
			'HS256',
		)) as any;
			assert.strictEqual(decoded.me, "http://localhost:3000");
			assert.strictEqual(decoded.client_id, "test-client");
		} finally {
			global.fetch = originalFetch;
		}
	});

	it("should handle authorization code grant type with JSON response from IndieAuth", async () => {
		const originalFetch = global.fetch;
		global.fetch = async (url: string | URL | Request, init?: RequestInit) => {
			if (url === "https://indieauth.com/auth" && init?.method === "POST") {
				return new Response(JSON.stringify({ me: "http://localhost:3000", scope: "create update" }), {
					status: 200,
					headers: { "content-type": "application/json" },
				});
			}
			return new Response("Not Found", { status: 404 });
		};

		try {
			const req = new Request("http://localhost/", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					Accept: "application/json",
				},
				body: "grant_type=authorization_code&code=valid-code&client_id=test-client&redirect_uri=http://localhost:3000/callback&code_verifier=verifier",
			});

			const res = await app.fetch(req);
			assert.strictEqual(res.status, 200);

			const data = await res.json();
			assert.ok(data.access_token);
			assert.strictEqual(data.me, "http://localhost:3000");
			assert.strictEqual(data.scope, "create update");
		} finally {
			global.fetch = originalFetch;
		}
	});

	it("should reject authorization code with invalid IndieAuth response", async () => {
		// Mock fetch for IndieAuth to return error
		const originalFetch = global.fetch;
		global.fetch = async (url: string | URL | Request, init?: RequestInit) => {
			if (url === "https://indieauth.com/auth" && init?.method === "POST") {
				return new Response("error=invalid_code", {
					status: 400,
					headers: { "content-type": "application/x-www-form-urlencoded" },
				});
			}
			return new Response("Not Found", { status: 404 });
		};

		try {
			const req = new Request("http://localhost/", {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: "grant_type=authorization_code&code=invalid-code&client_id=test-client&redirect_uri=http://localhost:3000/callback&code_verifier=verifier",
			});

			const res = await app.fetch(req);
			assert.strictEqual(res.status, 400);
		} finally {
			global.fetch = originalFetch;
		}
	});

	it("should reject authorization code with wrong 'me' URL", async () => {
		// Mock fetch for IndieAuth to return wrong 'me'
		const originalFetch = global.fetch;
		global.fetch = async (url: string | URL | Request, init?: RequestInit) => {
			if (url === "https://indieauth.com/auth" && init?.method === "POST") {
				return new Response("me=http://evil.com&scope=create+update", {
					status: 200,
					headers: { "content-type": "application/x-www-form-urlencoded" },
				});
			}
			return new Response("Not Found", { status: 404 });
		};

		try {
			const req = new Request("http://localhost/", {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: "grant_type=authorization_code&code=valid-code&client_id=test-client&redirect_uri=http://localhost:3000/callback&code_verifier=verifier",
			});

			const res = await app.fetch(req);
			assert.strictEqual(res.status, 400);
		} finally {
			global.fetch = originalFetch;
		}
	});

	it("should reject authorization code without client_id", async () => {
		const req = new Request("http://localhost/", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: "grant_type=authorization_code&code=valid-code&redirect_uri=http://localhost:3000/callback&code_verifier=verifier",
		});

		const res = await app.fetch(req);
		assert.strictEqual(res.status, 400);
	});

	it("should reject authorization code without code", async () => {
		const req = new Request("http://localhost/", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: "grant_type=authorization_code&client_id=test-client&redirect_uri=http://localhost:3000/callback&code_verifier=verifier",
		});

		const res = await app.fetch(req);
		assert.strictEqual(res.status, 400);

		const data = await res.json();
		assert.strictEqual(data.error, "Missing code");
	});

	it("should reject authorization code without redirect_uri", async () => {
		const req = new Request("http://localhost/", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: "grant_type=authorization_code&code=valid-code&client_id=test-client&code_verifier=verifier",
		});

		const res = await app.fetch(req);
		assert.strictEqual(res.status, 400);
	});

	it("should reject refresh_token grant type", async () => {
		const req = new Request("http://localhost/", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: "grant_type=refresh_token&refresh_token=some-token",
		});

		const res = await app.fetch(req);
		assert.strictEqual(res.status, 400);
	});

	it("should reject unknown grant type", async () => {
		const req = new Request("http://localhost/", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: "grant_type=unknown_grant_type",
		});

		const res = await app.fetch(req);
		assert.strictEqual(res.status, 400);
	});

	it("should reject requests with both action and grant_type", async () => {
		const req = new Request("http://localhost/", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: "action=revoke&grant_type=authorization_code",
		});

		const res = await app.fetch(req);
		assert.strictEqual(res.status, 400);
	});

	it("should handle token verification GET with valid token", async () => {
		const payload = {
			me: "http://localhost:3000",
			client_id: "test-client",
			scope: "create update",
			date_issued: new Date(),
			exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour from now
		};
		const validToken = await sign(payload, process.env.TOKEN_SECRET!, 'HS256');

		const req = new Request("http://localhost/", {
			method: "GET",
			headers: {
				Authorization: `Bearer ${validToken}`,
				Accept: "application/json",
			},
		});

		const res = await app.fetch(req);
		assert.strictEqual(res.status, 200);

		const data = await res.json();
		assert.strictEqual(data.me, "http://localhost:3000");
		assert.strictEqual(data.client_id, "test-client");
		assert.strictEqual(data.scope, "create update");
	});

	it("should reject token verification GET without authorization header", async () => {
		const req = new Request("http://localhost/", { method: "GET" });

		const res = await app.fetch(req);
		assert.strictEqual(res.status, 401);
	});

	it("should reject token verification GET with invalid token", async () => {
		const req = new Request("http://localhost/", {
			method: "GET",
			headers: { Authorization: "Bearer invalid-token" },
		});

		const res = await app.fetch(req);
		assert.strictEqual(res.status, 401);
	});

	it("should reject token verification GET with token from wrong domain", async () => {
		const payload = {
			me: "http://evil.com",
			client_id: "test-client",
			scope: "create update",
			date_issued: new Date(),
			exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour from now
		};
		const invalidToken = await sign(payload, process.env.TOKEN_SECRET!, 'HS256');

		const req = new Request("http://localhost/", {
			method: "GET",
			headers: { Authorization: `Bearer ${invalidToken}` },
		});

		const res = await app.fetch(req);
		assert.strictEqual(res.status, 401);
	});

	it("should return form-urlencoded response when Accept header doesn't include JSON", async () => {
		const payload = {
			me: "http://localhost:3000",
			client_id: "test-client",
			scope: "create update",
			date_issued: new Date(),
			exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour from now
		};
		const validToken = await sign(payload, process.env.TOKEN_SECRET!, 'HS256');

		const req = new Request("http://localhost/", {
			method: "GET",
			headers: {
				Authorization: `Bearer ${validToken}`,
				Accept: "text/html",
			},
		});

		const res = await app.fetch(req);
		assert.strictEqual(res.status, 200);
		const contentType = res.headers.get("Content-Type") || "";
		assert.ok(contentType.includes("application/x-www-form-urlencoded"));

		const text = await res.text();
		const params = new URLSearchParams(text);
		assert.strictEqual(params.get("me"), "http://localhost:3000");
		assert.strictEqual(params.get("client_id"), "test-client");
		assert.strictEqual(params.get("scope"), "create update");
	});

	it("should handle action=revoke", async () => {
		const req = new Request("http://localhost/", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: "action=revoke",
		});

		const res = await app.fetch(req);
		assert.strictEqual(res.status, 400); // Currently returns 400, could be changed to 200 if revoke is implemented
	});

	it("should handle unknown action", async () => {
		const req = new Request("http://localhost/", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: "action=unknown_action",
		});

		const res = await app.fetch(req);
		assert.strictEqual(res.status, 400);
	});

	it("should handle requests without action or grant_type", async () => {
		const req = new Request("http://localhost/", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: "some_other_field=value",
		});

		const res = await app.fetch(req);
		assert.strictEqual(res.status, 500);
	});
});
