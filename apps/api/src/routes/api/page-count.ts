import type { Context } from "hono";
import { searchPosts } from "../../lib/search-posts.js";

export async function pageCountHandler(c: Context) {
	try {
		const body = await c.req.json();
		const { posts, limit } = await searchPosts(body, c.get("isAdmin") || false);
		return c.json({ pageCount: Math.ceil(posts.length / limit) });
	} catch (err) {
		console.error("[Search error]", err);
		return c.json({ pageCount: 0 });
	}
}
