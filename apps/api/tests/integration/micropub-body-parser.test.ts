import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../../src/index.js";

describe("Micropub body parsing", () => {
	let server: any;
	let baseUrl: string;

	before(async () => {
		server = await new Promise((resolve) => {
			const httpServer = createApp().listen(0, () => {
				const address = httpServer.address();
				const port = typeof address === "object" && address ? address.port : 0;
				baseUrl = `http://localhost:${port}`;
				resolve(httpServer);
			});
		});
	});

	after(() => {
		server?.close();
	});

	it("returns auth failure instead of stream parser failure for JSON Micropub posts", async () => {
		const response = await fetch(`${baseUrl}/micropub`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({ type: ["h-entry"], properties: { content: ["Test post"] } }),
		});

		assert.strictEqual(response.status, 401);

		const body = await response.text();
		assert.doesNotMatch(body, /stream is not readable/i);
	});
});
