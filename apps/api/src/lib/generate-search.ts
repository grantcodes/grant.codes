import pluralize from "pluralize";
import type { ListOptions, Post } from "@postr/core";
const { singular } = pluralize;

export interface SearchQuery {
	typeOrYear?: string | number;
	type?: string;
	year?: number;
	month?: number;
	day?: number;
	category?: string;
	slug?: string | string[];
	postStatus?: string;
	search?: string;
	likeOfDomains?: string[];
	page?: number;
}

export interface GenerateSearchOptions {
	query?: SearchQuery;
	limit?: number;
	showAll?: boolean;
	isAdmin?: boolean;
}

export interface SearchResult {
	/** Options for `postr.posts.list()`; it always returns every match. */
	list: ListOptions;
	/** Conditions `posts.list()` cannot express, applied to its results. */
	filter: (post: Post) => boolean;
	skip: number;
	limit: number;
}

export const defaultPostTypes = [
	"note",
	"photo",
	"article",
	"repost",
	"quotation",
	"video",
	"audio",
	"collection",
];

type Visibility = "public" | "listed" | "any";

// 1.x matched dates on `created` or `published`, whichever fell in the range.
const inRange = (post: Post, start: Date, end: Date) =>
	[post.properties.created?.[0], post.published].some((value) => {
		if (typeof value !== "string") return false;
		const time = new Date(value).getTime();
		return time >= start.getTime() && time < end.getTime();
	});

/** Translates the site's 1.x search query into a postr 2 posts query. */
const generateSearch = ({
	query,
	limit = 10,
	showAll = false,
	isAdmin = false,
}: GenerateSearchOptions): SearchResult => {
	if (!query) {
		throw new Error("Missing query, cannot generate search");
	}

	query = { ...query };
	const list: ListOptions = {};
	const filters: Array<(post: Post) => boolean> = [];
	let postTypes: string[] | null = defaultPostTypes;
	let visibility: Visibility = "public";
	let status: string | null = "published";
	let skip = 0;

	// First param can be post type string or year number
	if (query.typeOrYear) {
		if (!isNaN(parseInt(query.typeOrYear.toString()))) {
			query.year = parseInt(query.typeOrYear.toString());
		} else {
			query.type = query.typeOrYear.toString();
		}
		postTypes = null;
		delete query.typeOrYear;
	}

	if (showAll) {
		// Anonymous requests never see drafts or private posts.
		visibility = isAdmin ? "any" : "listed";
		status = isAdmin ? null : "published";
	}

	limit = query.type === "photos" ? 50 : limit;

	if (query.page) {
		skip = (parseInt(query.page.toString()) - 1) * limit;
	}

	if (query.type) {
		postTypes = query.type === "all" ? null : [singular(query.type)];
		if (visibility === "public") visibility = "listed";
	}

	if (query.category) {
		list.category = query.category;
		if (!query.type) postTypes = null;
	}

	// A slug or full date looks up a single post.
	if (query.slug || (query.day && query.month && query.year)) {
		if (visibility === "public") visibility = "listed";
		postTypes = null;
		if (showAll && isAdmin) status = null;
	}

	if (query.postStatus) {
		if (
			(query.postStatus === "deleted" || query.postStatus === "draft") &&
			!isAdmin
		) {
			throw new Error(
				`You need to be an admin to see ${query.postStatus} posts`,
			);
		}
		status = query.postStatus;
	}

	if (query.slug) {
		const slug = Array.isArray(query.slug) ? query.slug[0] : query.slug;
		filters.push((post) => post.slug === slug);
	}

	if (query.year && query.month && query.day) {
		const start = new Date(`${query.year}-${query.month}-${query.day}`);
		// Need to do this so that time zones dont mess stuff up
		start.setDate(start.getDate() - 1);
		const end = new Date(start.getTime() + 2 * 24 * 60 * 60 * 1000);
		postTypes = null;
		filters.push((post) => inRange(post, start, end));
	} else if (query.year && query.month) {
		const start = new Date(`${query.year}-${query.month}-01`);
		const end = new Date(`${query.year}-${query.month}-01`);
		end.setMonth(start.getMonth() + 1);
		postTypes = null;
		filters.push((post) => inRange(post, start, end));
	}

	if (query.search) {
		postTypes = null;
		list.search = query.search.trim().replace("+", " ");
	}

	if (Array.isArray(query.likeOfDomains)) {
		const domains = query.likeOfDomains.map((domain) => new RegExp(domain, "i"));
		filters.push((post) => {
			const likeOf = post.properties["like-of"]?.[0];
			return typeof likeOf === "string" && domains.some((d) => d.test(likeOf));
		});
	}

	if (postTypes?.length === 1) {
		list.postType = postTypes[0];
	} else if (postTypes) {
		const types = postTypes;
		filters.push((post) => types.includes(post.postType));
	}

	if (visibility !== "public" || status !== "published") {
		list.includeHidden = true;
		if (visibility === "listed") {
			filters.push((post) => post.visibility !== "private");
		}
		if (status) {
			const wanted = status;
			filters.push((post) => post.status === wanted);
		}
	}

	return {
		list,
		filter: (post) => filters.every((filter) => filter(post)),
		skip,
		limit,
	};
};

export { generateSearch };
