import type { Context } from "hono";
import { postr } from "../../lib/postr.js";
import { generateSearch } from "../../lib/generate-search.js";

function getSearchQuery(body: Record<string, any>) {
	if (body.query && typeof body.query === "object" && !Array.isArray(body.query)) {
		return body.query;
	}

	const { query: _query, limit: _limit, skip: _skip, showAll: _showAll, ...rest } =
		body;

	return rest;
}

export async function pageCountHandler(c: Context) {
	try {
		const collection = await postr.getCollection();
		const body = await c.req.json();
		const isAdmin = c.get("isAdmin") || false;
		const query = getSearchQuery(body);

		let { limit = 10, search } = generateSearch({
			...body,
			query,
			isAdmin,
		});

		if (isAdmin) {
			delete search["properties.visibility.0"];
			search["properties.visibility"] = { $exists: true };
		}

		const docs = await collection.find(search).exec();
		const pageCount = Math.ceil(docs.length / limit);

		return c.json({ pageCount });
	} catch (err) {
		console.error("[Search error]", err);
		return c.json({ pageCount: 0 });
	}
}
