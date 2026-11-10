import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { Post } from "@postr/core";
import {
	generateSearch,
	SearchQuery,
} from "../../../src/lib/generate-search.js";

const post = (overrides: Partial<Post> = {}): Post =>
	({
		id: "1",
		url: "https://grant.codes/2023/05/03/hello",
		path: "/2023/05/03/hello",
		slug: "hello",
		type: "h-entry",
		postType: "note",
		status: "published",
		visibility: "public",
		published: "2023-05-03T10:00:00.000Z",
		publishedAt: 0,
		updated: "2023-05-03T10:00:00.000Z",
		deletedAt: null,
		children: null,
		properties: {},
		...overrides,
	}) as Post;

describe("generateSearch", () => {
	it("should list public, published posts of the default types", () => {
		const result = generateSearch({ query: {} });

		assert.strictEqual(result.limit, 10);
		assert.strictEqual(result.skip, 0);
		assert.deepStrictEqual(result.list, {});
		assert.ok(result.filter(post()));
		assert.ok(!result.filter(post({ postType: "like" })));
	});

	it("should handle custom limit", () => {
		assert.strictEqual(generateSearch({ query: {}, limit: 25 }).limit, 25);
	});

	it("should hide drafts and private posts from anonymous showAll", () => {
		const result = generateSearch({ query: {}, showAll: true });

		assert.strictEqual(result.list.includeHidden, true);
		assert.ok(result.filter(post({ visibility: "unlisted" })));
		assert.ok(!result.filter(post({ status: "draft" })));
		assert.ok(!result.filter(post({ visibility: "private" })));
	});

	it("should show everything to admin showAll", () => {
		const result = generateSearch({ query: {}, showAll: true, isAdmin: true });

		assert.ok(result.filter(post({ status: "draft", visibility: "private" })));
	});

	it("should filter by month for a year/month query", () => {
		const result = generateSearch({ query: { typeOrYear: "2023", month: 5 } });

		assert.ok(result.filter(post({ postType: "like" })));
		assert.ok(!result.filter(post({ published: "2023-07-03T10:00:00.000Z" })));
	});

	it("should handle type parameter", () => {
		const result = generateSearch({ query: { type: "photos" } });

		assert.strictEqual(result.list.postType, "photo");
		assert.strictEqual(result.limit, 50);
		assert.ok(result.filter(post({ postType: "photo", visibility: "unlisted" })));
		assert.ok(!result.filter(post({ postType: "photo", visibility: "private" })));
	});

	it("should handle category parameter", () => {
		const result = generateSearch({ query: { category: "journal" } });

		assert.strictEqual(result.list.category, "journal");
		assert.ok(result.filter(post({ postType: "like" })));
	});

	it("should handle slug parameter", () => {
		const result = generateSearch({ query: { slug: "hello" } });

		assert.ok(result.filter(post({ visibility: "unlisted" })));
		assert.ok(!result.filter(post({ slug: "other" })));
	});

	it("should handle pagination", () => {
		const query: SearchQuery = { page: 3 };
		assert.strictEqual(generateSearch({ query, limit: 10 }).skip, 20);
	});

	it("should use full-text search", () => {
		const result = generateSearch({ query: { search: "test+search" } });

		assert.strictEqual(result.list.search, "test search");
		assert.ok(result.filter(post({ postType: "like" })));
	});

	it("should handle admin access to draft posts", () => {
		const result = generateSearch({ query: { postStatus: "draft" }, isAdmin: true });

		assert.ok(result.filter(post({ status: "draft" })));
		assert.ok(!result.filter(post()));
	});

	it("should throw error for non-admin access to draft posts", () => {
		assert.throws(() => {
			generateSearch({ query: { postStatus: "draft" }, isAdmin: false });
		}, /You need to be an admin to see draft posts/);
	});

	it("should throw error for missing query", () => {
		assert.throws(() => {
			generateSearch({ query: undefined as any });
		}, /Missing query, cannot generate search/);
	});
});
