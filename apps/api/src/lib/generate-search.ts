import pluralize from "pluralize";
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

export interface SearchCriteria {
	[key: string]: any;
	$or?: Array<{ [key: string]: any }>;
}

export interface SearchResult {
	search: SearchCriteria;
	skip: number;
	limit: number;
}

const generateSearch = ({
	query,
	limit = 10,
	showAll = false,
	isAdmin = false,
}: GenerateSearchOptions): SearchResult => {
	let search: SearchCriteria = {};
	let addDefaultPostType = true;
	let skip = 0;

	if (!query) {
		throw new Error("Missing query, cannot generate search");
	}

	// From here on we know query exists; normalize to object type
	query = { ...query } as SearchQuery;

	// First param can be post type string or year number
	if (query.typeOrYear) {
		if (
			typeof query.typeOrYear === "number" ||
			!isNaN(parseInt(query.typeOrYear.toString()))
		) {
			query.year = parseInt(query.typeOrYear.toString());
			// When filtering by date, we do not restrict post type by default
			addDefaultPostType = false;
		} else {
			// If it's not a year, treat it as a type and clear the default
			query.type = query.typeOrYear.toString();
			// When a specific type is provided via first param,
			// don't include the default postType filter
			addDefaultPostType = false;
		}
		delete query.typeOrYear;
	}

	// Only show visible, published items, unless show all is set
	if (!showAll) {
		search["properties.visibility.0"] = "visible";
		search["properties.post-status.0"] = "published";
	}

	// Set posts per page.
	limit = query.type && query.type === "photos" ? 50 : limit;

	// Use pagination
	if (query.page) {
		skip = (parseInt(query.page.toString()) - 1) * limit;
	}

	// Set post type by default (unless disabled by earlier logic)
	if (addDefaultPostType) {
		search["cms.postType"] = {
			$in: [
				"note",
				"photo",
				"article",
				"repost",
				"quotation",
				"video",
				"audio",
				"collection",
			],
		};
	}
	if (query.type) {
		if (query.type === "all") {
			delete search["cms.postType"];
		} else {
			search["cms.postType"] = singular(query.type);
		}
		// TODO: Unsure if I should show unlisted posts in the post type archives or not
		search["properties.visibility.0"] = { $ne: "private" };
	}

	// Search category
	if (query.category) {
		search["properties.category"] = {
			$in: [query.category],
		};
		if (!query.type) {
			delete search["cms.postType"];
		}
	}

	// If a slug or year, month & day is set then we are looking for a single item.
	if (query.slug || (query.day && query.month && query.year)) {
		search["properties.visibility.0"] = {
			$ne: "private",
		};
		delete search["cms.postType"];
		if (showAll) {
			delete search["properties.post-status.0"];
		}
	}

	// Query post status
	if (query.postStatus) {
		search["properties.post-status.0"] = query.postStatus;
		if (
			(query.postStatus === "deleted" || query.postStatus === "draft") &&
			!isAdmin
		) {
			throw new Error(
				`You need to be an admin to see ${query.postStatus} posts`,
			);
		}
	}

	// Query slug
	if (query.slug) {
		const slug = Array.isArray(query.slug) ? query.slug[0] : query.slug;
		search["properties.mp-slug.0"] = slug;
	}

	// Query by date
	if (query.year && query.month && query.day) {
		const startDate = new Date(`${query.year}-${query.month}-${query.day}`);
		// Need to do this so that time zones dont mess stuff up
		startDate.setDate(startDate.getDate() - 1);
		const endDate = new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000);
		// When querying by specific date, do not restrict post type
		delete search["cms.postType"];
		search.$or = [
			{
				"properties.created.0": {
					$gte: startDate.toISOString(),
					$lt: endDate.toISOString(),
				},
			},
			{
				"properties.published.0": {
					$gte: startDate.toISOString(),
					$lt: endDate.toISOString(),
				},
			},
		];
	} else if (query.year && query.month) {
		// Get all in a specific month
		const startDate = new Date(`${query.year}-${query.month}-01`);
		const endDate = new Date(`${query.year}-${query.month}-01`);
		endDate.setMonth(startDate.getMonth() + 1);
		// When querying by month, do not restrict post type
		delete search["cms.postType"];
		search.$or = [
			{
				"properties.created.0": {
					$gte: startDate.toISOString(),
					$lt: endDate.toISOString(),
				},
			},
			{
				"properties.published.0": {
					$gte: startDate.toISOString(),
					$lt: endDate.toISOString(),
				},
			},
		];
	}

	// Search with text
	if (query.search) {
		delete search["cms.postType"];
		const searchRegex = new RegExp(
			query.search.toLowerCase().trim().replace("+", " "),
			"i",
		);
		search.$or = [
			{ "properties.name.0": { $regex: searchRegex } },
			{ "properties.summary.0": { $regex: searchRegex } },
			{ "properties.content.0.value": { $regex: searchRegex } },
		];
	}

	if (query.likeOfDomains) {
		if (Array.isArray(query.likeOfDomains)) {
			search.$or = query.likeOfDomains.map((domain) => ({
				"properties.like-of.0": { $regex: new RegExp(domain, "i") },
			}));
		}
	}

	return { search, skip, limit };
};

export { generateSearch };
