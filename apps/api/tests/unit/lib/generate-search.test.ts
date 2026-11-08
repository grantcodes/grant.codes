import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
	generateSearch,
	SearchQuery,
} from "../../../src/lib/generate-search.js";

describe("generateSearch", () => {
	it("should generate basic search criteria", () => {
		const query: SearchQuery = {};
		const result = generateSearch({ query });

		assert.strictEqual(result.limit, 10);
		assert.strictEqual(result.skip, 0);
		assert.strictEqual(result.search["properties.visibility.0"], "visible");
		assert.strictEqual(result.search["properties.post-status.0"], "published");
		assert.ok(result.search["cms.postType"]);
	});

	it("should handle custom limit", () => {
		const query: SearchQuery = {};
		const result = generateSearch({ query, limit: 25 });

		assert.strictEqual(result.limit, 25);
	});

	it("should handle showAll option", () => {
		const query: SearchQuery = {};
		const result = generateSearch({ query, showAll: true });

		assert.strictEqual(result.search["properties.visibility.0"], undefined);
		assert.strictEqual(result.search["properties.post-status.0"], undefined);
	});

	it("should handle typeOrYear parameter", () => {
		const query: SearchQuery = { typeOrYear: "2023" };
		const result = generateSearch({ query });

		assert.strictEqual(result.search["cms.postType"], undefined);
	});

	it("should handle type parameter", () => {
		const query: SearchQuery = { type: "photo" };
		const result = generateSearch({ query });

		assert.strictEqual(result.search["cms.postType"], "photo");
		assert.strictEqual(
			result.search["properties.visibility.0"]["$ne"],
			"private",
		);
	});

	it("should handle category parameter", () => {
		const query: SearchQuery = { category: "journal" };
		const result = generateSearch({ query });

		assert.deepStrictEqual(result.search["properties.category"], {
			$in: ["journal"],
		});
		assert.strictEqual(result.search["cms.postType"], undefined);
	});

	it("should handle slug parameter", () => {
		const query: SearchQuery = { slug: "test-post" };
		const result = generateSearch({ query });

		assert.strictEqual(result.search["properties.mp-slug.0"], "test-post");
		assert.strictEqual(result.search["cms.postType"], undefined);
		assert.deepStrictEqual(result.search["properties.visibility.0"], {
			$ne: "private",
		});
	});

	it("should handle pagination", () => {
		const query: SearchQuery = { page: 3 };
		const result = generateSearch({ query, limit: 10 });

		assert.strictEqual(result.skip, 20); // (3-1) * 10
	});

	it("should handle photos type with higher limit", () => {
		const query: SearchQuery = { type: "photos" };
		const result = generateSearch({ query });

		assert.strictEqual(result.limit, 50);
	});

	it("should handle search text", () => {
		const query: SearchQuery = { search: "test search" };
		const result = generateSearch({ query });

		assert.ok(result.search.$or);
		assert.strictEqual(result.search["cms.postType"], undefined);
	});

	it("should handle admin access to draft posts", () => {
		const query: SearchQuery = { postStatus: "draft" };
		const result = generateSearch({ query, isAdmin: true });

		assert.strictEqual(result.search["properties.post-status.0"], "draft");
	});

	it("should throw error for non-admin access to draft posts", () => {
		const query: SearchQuery = { postStatus: "draft" };

		assert.throws(() => {
			generateSearch({ query, isAdmin: false });
		}, /You need to be an admin to see draft posts/);
	});

	it("should throw error for missing query", () => {
		assert.throws(() => {
			generateSearch({ query: undefined as any });
		}, /Missing query, cannot generate search/);
	});
});
