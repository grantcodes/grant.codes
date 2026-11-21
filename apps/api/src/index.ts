import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { fileURLToPath } from "node:url";
import path, { relative } from "node:path";
import { postr, mediaDir } from "./lib/postr.js";
import { apiRouter } from "./routes/api/index.js";
import { deployWebhookRouter } from "./routes/api/deploy-webhook.js";
import { backgroundRouter as background } from "./routes/background/index.js";

const port = 4000;

// The Astro site, built by the root `pnpm start` before this server starts.
const siteDir = path.resolve(import.meta.dirname, "../../site/dist");

// Ported from the Next site's next.config.js.
const subdomainPages: Record<string, string> = {
	"where.is.grant.codes": "/where/",
	"who.is.grant.codes": "/about/",
	"pay.grant.codes": "/pay/",
};

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

	app.get("/.well-known/*", (c) => {
		const { pathname, search } = new URL(c.req.url);
		return c.redirect(`https://fed.brid.gy${pathname}${search}`, 307);
	});
	app.get("/", (c, next) => {
		const page = subdomainPages[new URL(c.req.url).hostname];
		return page
			? app.fetch(new Request(new URL(page, c.req.url), { headers: c.req.raw.headers }))
			: next();
	});
	app.use("*", serveStatic({ root: relative(process.cwd(), siteDir) }));

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
