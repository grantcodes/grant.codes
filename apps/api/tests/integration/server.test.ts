import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { serve, type ServerType } from "@hono/node-server";
import { createApp } from "../../src/index.js";
import { postr } from "../../src/lib/postr.js";

describe("Server Integration", () => {
	let server: ServerType;
	let baseUrl: string;

	before(async () => {
		const post = (properties: Record<string, string[]>) =>
			postr.posts.create(
				{ type: ["h-entry"], properties },
				{ origin: "import" },
			);
		await post({ content: ["A public note"], published: ["2024-05-03T10:00:00Z"] });
		await post({ "like-of": ["https://example.com/liked"], visibility: ["unlisted"] });
		await post({ content: ["A draft note"], "post-status": ["draft"] });

		server = await new Promise((resolve) => {
			const httpServer = serve({ fetch: createApp().fetch, port: 0 }, (info) => {
				baseUrl = `http://localhost:${info.port}`;
				resolve(httpServer);
			});
		});
	});

	after(() => {
		server?.close();
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

	const adminToken = () => process.env.MICROPUB_TOKEN!;

	const search = async (body: unknown, token?: string) => {
		const response = await fetch(`${baseUrl}/api/search`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...(token ? { Authorization: `Bearer ${token}` } : {}),
			},
			body: JSON.stringify(body),
		});
		assert.strictEqual(response.status, 200);
		return (await response.json()) as Array<{
			properties: Record<string, unknown[]>;
			cms: { postType: string };
		}>;
	};

	it("should search public posts in the 1.x shape", { timeout: 5000 }, async () => {
		const posts = await search({ query: { type: "note" } });
		assert.strictEqual(posts.length, 1);
		assert.strictEqual(posts[0].cms.postType, "note");
		assert.match(String(posts[0].properties.url[0]), /^http:\/\/localhost:3000\/2024\/05\/03\//);
	});

	it("should only show drafts to the permanent token", { timeout: 5000 }, async () => {
		const anonymous = await search({ query: { search: "note" }, showAll: true });
		assert.strictEqual(anonymous.length, 1);
		const admin = await search({ query: { search: "note" }, showAll: true }, adminToken());
		assert.strictEqual(admin.length, 2);
	});

	it("should only show unlisted posts to the permanent token", { timeout: 5000 }, async () => {
		assert.strictEqual((await search({ query: { type: "likes" } })).length, 0);
		assert.strictEqual(
			(await search({ query: { type: "likes" } }, adminToken())).length,
			1,
		);
	});

	it("should handle API page-count endpoint", { timeout: 5000 }, async () => {
		const response = await fetch(`${baseUrl}/api/page-count`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ query: { type: "note" }, limit: 1 }),
		});

		assert.strictEqual(response.status, 200);
		assert.deepStrictEqual(await response.json(), { pageCount: 1 });
	});

	it("should serve Micropub q=source with the permanent token", { timeout: 5000 }, async () => {
		const response = await fetch(`${baseUrl}/micropub?q=source&limit=5`, {
			headers: { Authorization: `Bearer ${process.env.MICROPUB_TOKEN}` },
		});
		assert.strictEqual(response.status, 200);
		const data = (await response.json()) as { items: unknown[] };
		assert.ok(data.items.length >= 1);
	});

	it("should redirect .well-known to Bridgy Fed", { timeout: 5000 }, async () => {
		const response = await fetch(
			`${baseUrl}/.well-known/webfinger?resource=acct:grant@grant.codes`,
			{ redirect: "manual" },
		);
		assert.strictEqual(response.status, 307);
		assert.strictEqual(
			response.headers.get("location"),
			"https://fed.brid.gy/.well-known/webfinger?resource=acct:grant@grant.codes",
		);
	});

	it("should serve feeds", { timeout: 5000 }, async () => {
		const response = await fetch(`${baseUrl}/micropub/plugin/feeds/rss`);
		assert.strictEqual(response.status, 200);
		assert.match(await response.text(), /A public note/);
	});

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
