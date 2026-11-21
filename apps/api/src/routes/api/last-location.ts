import type { Context } from "hono";

export async function lastLocationHandler(c: Context) {
	const dawarichUrl = process.env.DAWARICH_URL;
	const dawarichApiKey = process.env.DAWARICH_API_KEY;

	// If config is not available, return { location: false } instead of crashing
	if (!dawarichUrl || !dawarichApiKey) {
		return c.json({ location: false });
	}

	try {
		const response = await fetch(
			`${dawarichUrl}/api/v1/points?api_key=${dawarichApiKey}&per_page=1`,
			{
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				method: "GET",
			},
		);

		if (!response.ok) {
			return c.json({ location: false });
		}

		const data = (await response.json()) as unknown;

		if (Array.isArray(data) && data.length === 1) {
			return c.json({ location: data[0] });
		}

		return c.json({ location: false });
	} catch (err) {
		console.error("[last-location] fetch failed:", err);
		return c.json({ location: false });
	}
}
