import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../../src/index.js";

describe("Micropub body parsing", () => {
	it("returns auth failure instead of stream parser failure for JSON Micropub posts", async () => {
		const response = await createApp().request("/micropub", {
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
