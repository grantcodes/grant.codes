import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve, type Http2Bindings, type HttpBindings } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { RESPONSE_ALREADY_SENT } from "@hono/node-server/utils/response";
import type { IncomingMessage, ServerResponse } from "node:http";
import { fileURLToPath, pathToFileURL } from "node:url";
import path, { relative } from "node:path";
import { postr, mediaDir, database } from "./lib/postr.js";
import { apiRouter } from "./routes/api/index.js";
import { backgroundRouter as background } from "./routes/background/index.js";

const port = 4000;

// The Astro site, built by the root `pnpm build`.
const siteDir = path.resolve(import.meta.dirname, "../../site/dist");

type SiteHandler = (
	req: IncomingMessage,
	res: ServerResponse,
	next: () => void,
) => Promise<void>;

let siteHandler: Promise<SiteHandler | undefined> | undefined;

/** The site's on-demand renderer, or undefined when the site is not built (e.g. under `astro dev`). */
const loadSiteHandler = () => {
	process.env.POSTR_DATABASE ??= database;
	siteHandler ??= import(
		pathToFileURL(path.join(siteDir, "server/entry.mjs")).href
	).then(
		(site: { handler: SiteHandler }) => site.handler,
		(err) => {
			console.warn("[site] Not serving the site:", err.message);
			return undefined;
		},
	);
	return siteHandler;
};

// Marks a request no api route or static file handled, for the site to render.
const SITE_HEADER = "x-render-site";

// Ported from the Next site's next.config.js. Their pages must stay prerendered: the site renders
// the original request, not the rewritten one.
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
	app.use(
		"*",
		serveStatic({ root: relative(process.cwd(), path.join(siteDir, "client")) }),
	);
	app.all("*", (c) => c.body(null, 404, { [SITE_HEADER]: "1" }));

	return app;
};

const app = createApp();

/**
 * The server's request handler: the app, then the site for whatever it left. The site writes to
 * the Node response itself, outside Hono, whose middleware would rewrap RESPONSE_ALREADY_SENT.
 */
const handleRequest = async (request: Request, env: HttpBindings | Http2Bindings) => {
	const response = await app.fetch(request, env);
	if (!response.headers.has(SITE_HEADER)) return response;
	const notFound = () => new Response("404 Not Found", { status: 404 });
	const handler = await loadSiteHandler();
	if (!handler) return notFound();
	return new Promise<Response>((resolve, reject) => {
		// serve() starts an HTTP/1 server, so env carries Node's IncomingMessage and ServerResponse.
		const { incoming, outgoing } = env as HttpBindings;
		handler(incoming, outgoing, () =>
			resolve(notFound()),
		).then(() => resolve(RESPONSE_ALREADY_SENT), reject);
	});
};

const isEntrypoint = process.argv[1] === fileURLToPath(import.meta.url);

if (isEntrypoint) {
	serve({ fetch: handleRequest, port }, () => {
		console.log(
			`Backend up and running on http://localhost:${port}, serving media from ${mediaDir}`,
		);
	});
}

export { app, createApp, handleRequest };
