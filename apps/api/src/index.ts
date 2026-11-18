import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { fileURLToPath } from "node:url";
import { relative } from "node:path";
import { postr, mediaDir } from "./lib/postr.js";
import { apiRouter } from "./routes/api/index.js";
import { deployWebhookRouter } from "./routes/api/deploy-webhook.js";
import { backgroundRouter as background } from "./routes/background/index.js";

const port = 4000;

const createApp = () => {
	const app = new Hono();

	app.use("*", cors());

	// postr serves Micropub (and plugin routes) at the path of its endpoint URL.
	app.all("/micropub", (c) => postr.fetch(c.req.raw));
	app.all("/micropub/*", (c) => postr.fetch(c.req.raw));

	app.use(
		"/media/*",
		serveStatic({
			root: relative(process.cwd(), mediaDir),
			rewriteRequestPath: (path) => path.replace(/^\/media/, ""),
		}),
	);

	// Mount deploy-webhook before generic /api so it matches first
	app.route("/api/deploy-webhook", deployWebhookRouter);
	app.route("/api", apiRouter);
	app.route("/background", background);

	return app;
};

const app = createApp();

const isEntrypoint = process.argv[1] === fileURLToPath(import.meta.url);

if (isEntrypoint) {
	serve({ fetch: app.fetch, port }, () => {
		console.log(
			`Backend up and running on http://localhost:${port}, serving media from ${mediaDir}`,
		);
	});
}

export { app, createApp };
