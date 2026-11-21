import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { backgroundRouter as background } from "../../../src/routes/background/index.js";

describe("Background Routes Content Type Regression", () => {
	// Create a test app with just the background routes
	const app = new Hono();
	app.use("*", cors());
	app.route("/background", background);

	it("should return correct content type for all SVG routes", async () => {
		// Test all SVG route patterns to ensure they return image/svg+xml
		const svgRoutes = [
			"/background/1600/2400/ff0345.svg", // Custom color with dimensions
			"/background/800/600/background.svg", // Default theme with dimensions
			"/background/background.svg", // Default theme without dimensions
			"/background/abc123.svg", // Custom color without dimensions
		];

		for (const route of svgRoutes) {
			const req = new Request(`http://localhost:4000${route}`);
			const res = await app.fetch(req);

			assert.strictEqual(res.status, 200, `Route ${route} should return 200`);
			assert.strictEqual(
				res.headers.get("Content-Type"),
				"image/svg+xml",
				`Route ${route} should return image/svg+xml content type, but got ${res.headers.get("Content-Type")}`,
			);

			// Verify it's actually valid SVG content
			const content = await res.text();
			assert.ok(
				content.includes("<svg"),
				`Route ${route} should return valid SVG content`,
			);
			assert.ok(
				content.includes("xmlns="),
				`Route ${route} should include SVG namespace`,
			);
		}
	});

	it("should return correct content type for JPG routes", async () => {
		const jpgRoutes = [
			"/background/800/600/background.jpg", // This route works correctly
		];

		for (const route of jpgRoutes) {
			const req = new Request(`http://localhost:4000${route}`);
			const res = await app.fetch(req);

			assert.strictEqual(res.status, 200, `Route ${route} should return 200`);
			assert.strictEqual(
				res.headers.get("Content-Type"),
				"image/jpeg",
				`Route ${route} should return image/jpeg content type, but got ${res.headers.get("Content-Type")}`,
			);
		}
	});

	it("should return correct content type for PNG routes", async () => {
		const pngRoutes = [
			"/background/800/600/background.png", // This route works correctly
		];

		for (const route of pngRoutes) {
			const req = new Request(`http://localhost:4000${route}`);
			const res = await app.fetch(req);

			assert.strictEqual(res.status, 200, `Route ${route} should return 200`);
			assert.strictEqual(
				res.headers.get("Content-Type"),
				"image/png",
				`Route ${route} should return image/png content type, but got ${res.headers.get("Content-Type")}`,
			);
		}
	});

	it("should return JPEG and non-empty body for /background/me.jpg", async () => {
		const req = new Request("http://localhost:4000/background/me.jpg");
		const res = await app.fetch(req);

		assert.strictEqual(
			res.status,
			200,
			`Route /background/me.jpg should return 200`,
		);
		assert.strictEqual(
			res.headers.get("Content-Type"),
			"image/jpeg",
			"Route /background/me.jpg should return image/jpeg content type",
		);

		const buf = await res.arrayBuffer();
		assert.ok(
			buf.byteLength > 0,
			"Route /background/me.jpg should return non-empty body",
		);
	});

	it("should test the specific regression case that was fixed", async () => {
		// This test specifically covers the issue that was reported
		const req = new Request(
			"http://localhost:4000/background/1600/2400/ff0345.svg",
		);
		const res = await app.fetch(req);

		assert.strictEqual(res.status, 200);
		assert.strictEqual(
			res.headers.get("Content-Type"),
			"image/svg+xml",
			"Should return image/svg+xml content type, not text/plain",
		);

		// Verify it's actually valid SVG content
		const content = await res.text();
		assert.ok(content.includes("<svg"), "Should return valid SVG content");
		assert.ok(content.includes("xmlns="), "Should include SVG namespace");
	});
});
