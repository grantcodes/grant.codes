import { Hono } from "hono";
import authMiddleware from "@postr/core/lib/middlewear/auth.js";
import { searchHandler } from "./search.js";
import { pageCountHandler } from "./page-count.js";
import { lastLocationHandler } from "./last-location.js";
import { adaptExpressMiddleware } from "../../utils/express-middleware-adapter.js";

const apiRouter = new Hono();

apiRouter.use("*", adaptExpressMiddleware(authMiddleware));

apiRouter.post("/search", searchHandler);
apiRouter.post("/page-count", pageCountHandler);
apiRouter.get("/last-location", lastLocationHandler);

export { apiRouter };
