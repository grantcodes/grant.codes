import { Hono } from "hono";
import { isAdminRequest } from "../../lib/token.js";
import { searchHandler } from "./search.js";
import { pageCountHandler } from "./page-count.js";
import { lastLocationHandler } from "./last-location.js";

const apiRouter = new Hono<{ Variables: { isAdmin: boolean } }>();

// Public reads; a valid token also unlocks hidden posts.
apiRouter.use("*", async (c, next) => {
	c.set("isAdmin", await isAdminRequest(c.req.header("Authorization")));
	await next();
});

apiRouter.post("/search", searchHandler);
apiRouter.post("/page-count", pageCountHandler);
apiRouter.get("/last-location", lastLocationHandler);

export { apiRouter };
