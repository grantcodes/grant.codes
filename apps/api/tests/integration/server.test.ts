import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import cors from "cors";
import { resolve } from "node:path";
import { apiRouter } from "../../src/routes/api/index.js";
import { backgroundRouter as background } from "../../src/routes/background/index.js";
import { adaptHonoToExpress } from "../../src/utils/hono-to-express-adapter.js";
import { sign } from "hono/jwt";

// Mock the dependencies that require environment setup
const mockPostr = {
	getCollection: async () => ({
		find: () => ({
			exec: async () => [
				{
					toMf2: () => ({
						type: ["h-entry"],
						properties: { content: ["Test Post"] },
					}),
					get: () => false,
				},
			],
			where: () => ({
				ne: () => ({}),
				eq: () => ({}),
			}),
			sort: () => ({
				limit: () => ({
					skip: () => ({
						exec: async () => [
							{
								toMf2: () => ({
									type: ["h-entry"],
									properties: { content: ["Test Post"] },
								}),
								get: () => false,
							},
						],
					}),
				}),
			}),
		}),
		sync: () => {},
	}),
};

// Mock canvas and themer
const mockCanvas = {
	createCanvas: () => ({
		getContext: () => ({
			fillRect: () => {},
			translate: () => {},
			beginPath: () => {},
			lineTo: () => {},
			fill: () => {},
			closePath: () => {},
		}),
		toBuffer: () => Buffer.from("mock-image-data"),
	}),
	loadImage: async () => ({
		width: 100,
		height: 100,
	}),
};

const mockThemer = {
	daily: () => ({ gradient: ["#ff0000", "#00ff00", "#0000ff"] }),
	fromColor: () => ({ gradient: ["#ff0000", "#00ff00", "#0000ff"] }),
};

const mockNoise = {
	Noise: class MockNoise {
		constructor() {}
		perlin2() {
			return 0.5;
		}
	},
};

describe("Server Integration", () => {
	let server: any;
	let baseUrl: string;

	before(async () => {
		// Set up test environment variables
		process.env.NODE_ENV = "test";
		process.env.NEXT_PUBLIC_API_URL = "http://localhost:4000";
		process.env.NEXT_PUBLIC_URL = "http://localhost:3000";
		process.env.NEXT_PUBLIC_MEDIA_BASE_URL = "http://localhost:4000/media";
		process.env.NEXT_PUBLIC_AUTHOR_NAME = "Test Author";
		process.env.NEXT_PUBLIC_AUTHOR_PHOTO =
			"http://localhost:4000/media/photo.jpg";
		process.env.NEXT_PUBLIC_AUTHOR_EMAIL = "test@example.com";
		process.env.MICROPUB_TOKEN = "test-micropub-token";
		process.env.TOKEN_SECRET = "test-secret";
		process.env.MICROPUB_ENDPOINT_PASSWORD_SERVER = "test-db-password";

		// Mock modules
		try {
			const { mock } = await import("node:test");
			if (mock && typeof (mock as any).module === "function") {
				(mock as any).module("../../src/lib/postr.js", { default: mockPostr });
				(mock as any).module("canvas", mockCanvas);
				(mock as any).module("@grantcodes/themer", mockThemer);
				(mock as any).module("noisejs", mockNoise);
			}
		} catch {
			// If mocking API is unavailable, proceed without mocking
		}

		// Create Express test server
		const app = express();

		// Apply CORS middleware
		app.use(cors());

		// Parse JSON bodies
		app.use(express.json());
		app.use(express.urlencoded({ extended: true }));

		// Apply custom routes using Hono-to-Express adapter
		app.use("/api", adaptHonoToExpress(apiRouter));
		app.use("/background", adaptHonoToExpress(background));

		// Start server on random port and wait for it to be ready
		server = await new Promise((resolve) => {
			const httpServer = app.listen(0, () => {
				const address = httpServer.address();
				const port = typeof address === "object" && address ? address.port : 0;
				baseUrl = `http://localhost:${port}`;
				resolve(httpServer);
			});
		});
	});

	after(async () => {
		if (server) {
			server.close();
		}
	});

	it("should handle CORS preflight requests", { timeout: 5000 }, async () => {
		const response = await fetch(`${baseUrl}/api/search`, {
			method: "OPTIONS",
			headers: {
				"Access-Control-Request-Method": "POST",
				"Access-Control-Request-Headers": "Content-Type, Authorization",
				Origin: "http://localhost:3000",
			},
		});

		// Hono CORS middleware responds with 204 No Content for preflight
		assert.ok([200, 204].includes(response.status));
		assert.ok(response.headers.get("Access-Control-Allow-Origin"));
		assert.ok(response.headers.get("Access-Control-Allow-Methods"));
		assert.ok(response.headers.get("Access-Control-Allow-Headers"));
	});

	it.skip("should handle API search endpoint", { timeout: 5000 }, async () => {
		const response = await fetch(`${baseUrl}/api/search`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				// Use a valid JWT for auth middleware
			Authorization: `Bearer ${await sign(
				{
					me: process.env.NEXT_PUBLIC_URL!,
					client_id: "test-client",
					scope: "test",
					date_issued: new Date(),
					exp: Math.floor(Date.now() / 1000) + 60 * 60,
				},
				process.env.TOKEN_SECRET!,
				'HS256',
			)}`,
			},
			body: JSON.stringify({ query: { type: "note" } }),
		});

		assert.strictEqual(response.status, 200);
		const data = await response.json();
		assert.ok(Array.isArray(data));
	});

	it.skip(
		"should handle API page-count endpoint",
		{ timeout: 5000 },
		async () => {
			const response = await fetch(`${baseUrl}/api/page-count`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${await sign(
						{
							me: process.env.NEXT_PUBLIC_URL!,
							client_id: "test-client",
							scope: "test",
							date_issued: new Date(),
							exp: Math.floor(Date.now() / 1000) + 60 * 60,
						},
						process.env.TOKEN_SECRET!,
					)}`,
				},
				body: JSON.stringify({ query: { type: "note" } }),
			});

			assert.strictEqual(response.status, 200);
			const data = await response.json();
			assert.ok(typeof data.pageCount === "number");
		},
	);

	it("should handle background SVG generation", { timeout: 5000 }, async () => {
		const response = await fetch(
			`${baseUrl}/background/100/100/background.svg`,
		);

		assert.strictEqual(response.status, 200);
		assert.ok(response.headers.get("Content-Type")?.includes("image/svg+xml"));
		const svg = await response.text();
		assert.ok(svg.includes("<svg") || svg.includes("mock-image-data"));
	});

	it("should handle background JPG generation", { timeout: 5000 }, async () => {
		const response = await fetch(
			`${baseUrl}/background/100/100/background.jpg`,
		);

		assert.strictEqual(response.status, 200);
		assert.ok(response.headers.get("Content-Type")?.includes("image/jpeg"));
		const buffer = await response.arrayBuffer();
		assert.ok(buffer.byteLength > 0);
	});

	it("should handle background PNG generation", { timeout: 5000 }, async () => {
		const response = await fetch(
			`${baseUrl}/background/100/100/background.png`,
		);

		assert.strictEqual(response.status, 200);
		assert.ok(response.headers.get("Content-Type")?.includes("image/png"));
		const buffer = await response.arrayBuffer();
		assert.ok(buffer.byteLength > 0);
	});

	it(
		"should handle background with custom color",
		{ timeout: 5000 },
		async () => {
			const response = await fetch(`${baseUrl}/background/100/100/ff0000.svg`);

			assert.strictEqual(response.status, 200);
			assert.ok(
				response.headers.get("Content-Type")?.includes("image/svg+xml"),
			);
		},
	);

	it(
		"should handle default background generation",
		{ timeout: 5000 },
		async () => {
			const response = await fetch(`${baseUrl}/background/background.svg`);

			assert.strictEqual(response.status, 200);
			assert.ok(
				response.headers.get("Content-Type")?.includes("image/svg+xml"),
			);
		},
	);

	it("should handle profile image generation", { timeout: 5000 }, async () => {
		const response = await fetch(`${baseUrl}/background/me.jpg`);

		assert.strictEqual(response.status, 200);
		assert.ok(response.headers.get("Content-Type")?.includes("image/jpeg"));
	});

	it("should handle background theme endpoint", { timeout: 5000 }, async () => {
		const response = await fetch(`${baseUrl}/background`);

		assert.strictEqual(response.status, 200);
		const data = await response.json();
		assert.ok(data.theme);
		assert.ok(data.svg);
	});

	it(
		"should return correct content type for all SVG routes to prevent regression",
		{ timeout: 10000 },
		async () => {
			// Test all SVG route patterns to ensure they return image/svg+xml
			const svgRoutes = [
				`${baseUrl}/background/1600/2400/ff0345.svg`, // Custom color with dimensions
				`${baseUrl}/background/800/600/background.svg`, // Default theme with dimensions
				`${baseUrl}/background/background.svg`, // Default theme without dimensions
				`${baseUrl}/background/abc123.svg`, // Custom color without dimensions
			];

			for (const route of svgRoutes) {
				const response = await fetch(route);

				assert.strictEqual(
					response.status,
					200,
					`Route ${route} should return 200`,
				);
				assert.ok(
					response.headers.get("Content-Type")?.includes("image/svg+xml"),
					`Route ${route} should return image/svg+xml content type, but got ${response.headers.get("Content-Type")}`,
				);

				// Verify it's actually valid SVG content
				const content = await response.text();
				assert.ok(
					content.includes("<svg"),
					`Route ${route} should return valid SVG content`,
				);
				assert.ok(
					content.includes("xmlns="),
					`Route ${route} should include SVG namespace`,
				);
			}
		},
	);

	it.skip(
		"should reject unauthorized API requests",
		{ timeout: 5000 },
		async () => {
			const response = await fetch(`${baseUrl}/api/search`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ query: { type: "note" } }),
			});

			assert.strictEqual(response.status, 401);
		},
	);
});
