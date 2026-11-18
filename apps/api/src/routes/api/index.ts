import { Hono } from "hono";
import { env } from "../../config/env.js";
import { searchHandler } from "./search.js";
import { pageCountHandler } from "./page-count.js";
import { lastLocationHandler } from "./last-location.js";

const apiRouter = new Hono<{ Variables: { isAdmin: boolean } }>();

// Public reads; the permanent MICROPUB_TOKEN also unlocks hidden posts.
apiRouter.use("*", async (c, next) => {
	const token = c.req.header("Authorization")?.replace(/^Bearer\s+/i, "").trim();
	c.set("isAdmin", Boolean(token) && token === env.MICROPUB_TOKEN);
	await next();
});

apiRouter.post("/search", searchHandler);
apiRouter.post("/page-count", pageCountHandler);
apiRouter.get("/last-location", lastLocationHandler);

export { apiRouter };
