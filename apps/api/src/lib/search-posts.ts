import type { Mf2Item, Post } from "@postr/core";
import { postr } from "./postr.js";
import {
	generateSearch,
	type GenerateSearchOptions,
	type SearchQuery,
} from "./generate-search.js";

/** A 1.x `/api/search` body: options plus the query, nested or flattened. */
export type SearchBody = Omit<GenerateSearchOptions, "query" | "isAdmin"> &
	SearchQuery & { query?: unknown; skip?: unknown };

function getSearchQuery(body: SearchBody): SearchQuery {
	if (body.query && typeof body.query === "object" && !Array.isArray(body.query)) {
		return body.query as SearchQuery;
	}

	const { query: _query, limit: _limit, skip: _skip, showAll: _showAll, ...rest } =
		body;

	return rest;
}

// 1.x sorted by indexDate: `created` when a post has it, else `published`.
const postTime = (post: Post) => {
	const created = post.properties.created?.[0];
	return new Date(typeof created === "string" ? created : post.published).getTime();
};

/** Every post matching a 1.x `/api/search` request body, newest first. */
export async function searchPosts(body: SearchBody, isAdmin: boolean) {
	const { list, filter, skip, limit } = generateSearch({
		...(body.limit ? { limit: body.limit } : {}),
		...(body.showAll ? { showAll: body.showAll } : {}),
		query: getSearchQuery(body),
		isAdmin,
	});
	const posts = (
		await postr.posts.list({ ...list, limit: Number.MAX_SAFE_INTEGER })
	)
		.filter(filter)
		.sort((a, b) => postTime(b) - postTime(a));
	return { posts, skip, limit };
}

/** The 1.x `toMf2()` shape: mf2 with the url, populated children and `cms.postType`. */
export async function toLegacyMf2(post: Post) {
	const mf2: Mf2Item & { cms: { postType: string } } = {
		...postr.posts.toMf2(post),
		cms: { postType: post.postType },
	};
	if (post.children?.length) {
		const children = await Promise.all(
			post.children.map((url) => postr.posts.getByUrl(url)),
		);
		mf2.children = children
			.filter((child): child is Post => Boolean(child))
			.map((child) => postr.posts.toMf2(child));
	}
	return mf2;
}
