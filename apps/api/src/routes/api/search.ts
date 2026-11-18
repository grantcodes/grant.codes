import type { Context } from "hono";
import { searchPosts, toLegacyMf2 } from "../../lib/search-posts.js";

export async function searchHandler(c: Context) {
	try {
		const body = await c.req.json();
		const { posts, skip, limit } = await searchPosts(
			body,
			c.get("isAdmin") || false,
		);
		return c.json(
			await Promise.all(posts.slice(skip, skip + limit).map(toLegacyMf2)),
		);
	} catch (err) {
		console.error("[Search error]", err);
		return c.json([]);
	}
}
