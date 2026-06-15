import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { deployWebhookRouter } from "../../../src/routes/api/deploy-webhook.js";

describe("POST /api/deploy-webhook", () => {
	const MICROPUB_TOKEN = "test-micropub-token";

	before(() => {
		process.env.MICROPUB_TOKEN = MICROPUB_TOKEN;
	});

	after(() => {
		delete process.env.DEPLOY_WEBHOOK_URL;
	});

	it("should return 401 when no Authorization header is provided", async () => {
		const request = new Request("http://localhost:4000/", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
		});
		const response = await deployWebhookRouter.fetch(request);
		assert.strictEqual(response.status, 401);

		const body = await response.json();
		assert.strictEqual(body.error, "Unauthorized");
	});

	it("should return 401 when the token does not match MICROPUB_TOKEN", async () => {
		const request = new Request("http://localhost:4000/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer wrong-token",
			},
		});
		const response = await deployWebhookRouter.fetch(request);
		assert.strictEqual(response.status, 401);

		const body = await response.json();
		assert.strictEqual(body.error, "Unauthorized");
	});

	it("should return 501 when DEPLOY_WEBHOOK_URL is not configured", async () => {
		// Ensure DEPLOY_WEBHOOK_URL is not set
		delete process.env.DEPLOY_WEBHOOK_URL;

		const request = new Request("http://localhost:4000/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${MICROPUB_TOKEN}`,
			},
		});
		const response = await deployWebhookRouter.fetch(request);
		assert.strictEqual(response.status, 501);

		const body = await response.json();
		assert.ok(body.error.includes("not configured"));
	});

	it("should return 502 when the webhook request fails (network error)", async () => {
		process.env.DEPLOY_WEBHOOK_URL = "http://localhost:1/nonexistent";

		const request = new Request("http://localhost:4000/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${MICROPUB_TOKEN}`,
			},
		});
		const response = await deployWebhookRouter.fetch(request);
		assert.strictEqual(response.status, 502);

		const body = await response.json();
		assert.strictEqual(body.success, false);
		assert.strictEqual(body.error, "Request failed");
	});

	it("should return 200 on successful webhook POST", async () => {
		// Mock fetch to return success
		const originalFetch = globalThis.fetch;
		globalThis.fetch = async (
			_url: string | URL | Request,
			_init?: RequestInit,
		) => {
			return new Response("OK", { status: 200 });
		};

		try {
			process.env.DEPLOY_WEBHOOK_URL = "https://example.com/deploy";

			const request = new Request("http://localhost:4000/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${MICROPUB_TOKEN}`,
				},
			});
			const response = await deployWebhookRouter.fetch(request);
			assert.strictEqual(response.status, 200);

			const body = await response.json();
			assert.strictEqual(body.success, true);
		} finally {
			globalThis.fetch = originalFetch;
		}
	});

	it("should return { success: false } when webhook returns non-2xx", async () => {
		const originalFetch = globalThis.fetch;
		globalThis.fetch = async (
			_url: string | URL | Request,
			_init?: RequestInit,
		) => {
			return new Response("Server Error", { status: 500 });
		};

		try {
			process.env.DEPLOY_WEBHOOK_URL = "https://example.com/deploy";

			const request = new Request("http://localhost:4000/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${MICROPUB_TOKEN}`,
				},
			});
			const response = await deployWebhookRouter.fetch(request);
			assert.strictEqual(response.status, 200);

			const body = await response.json();
			assert.strictEqual(body.success, false);
			assert.strictEqual(body.status, 500);
		} finally {
			globalThis.fetch = originalFetch;
		}
	});
});
