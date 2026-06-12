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

export async function searchHandler(c: Context) {
	try {
		const collection = await postr.getCollection();
		const body = await c.req.json();
		const isAdmin = c.get("isAdmin") || false;
		const query = getSearchQuery(body);

		let {
			limit = 10,
			skip = 0,
			search,
		} = generateSearch({
			...body,
			query,
			isAdmin,
		});

		// TODO: Check security that people cant manually send visibility options to get private content
		// TODO: Non admins shouldn't see post-status=deleted or draft
		if (isAdmin) {
			delete search["properties.visibility.0"];
			search["properties.visibility"] = { $exists: true };
		}

		const docs = await collection
			.find(search)
			.sort({ indexDate: "desc" })
			.limit(limit)
			.skip(skip)
			.exec();

		const postPromises = docs.map(async (doc: any) => {
			const mf2 = doc.toMf2();
			if (doc.get("cms.children")) {
				try {
					const children = await doc.populate("cms.children");
					if (children && Array.isArray(children)) {
						mf2.children = children
							.filter((child: any) => !!child)
							.map((child: any) => child.toMf2());
					} else {
						throw new Error("children not valid");
					}
				} catch (err) {
					console.warn("[Error populating children]", err);
				}
			}
			return mf2;
		});

		const posts = await Promise.all(postPromises);

		return c.json(posts);
	} catch (err) {
		console.error("[Search error]", err);
		return c.json([]);
	}
}
