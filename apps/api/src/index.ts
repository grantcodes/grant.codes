import express from "express";
import cors from "cors";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { postr } from "./lib/postr.js";
import { apiRouter } from "./routes/api/index.js";
import { deployWebhookRouter } from "./routes/api/deploy-webhook.js";
import { tokenRouter as tokenEndpoint } from "./routes/token.js";
import { backgroundRouter as background } from "./routes/background/index.js";
import { adaptHonoToExpress } from "./utils/hono-to-express-adapter.js";

const port = 4000;
const mediaPath = resolve(import.meta.dirname!, "../../../media");

const createApp = () => {
	console.log("Initializing backend");

	// Create Express app
	const app = express();

	// Apply CORS middleware
	app.use(cors());

	// Apply Postr routes before global body parsers because Postr
	// parses Micropub request bodies internally.
	app.use("/micropub", postr.expressRouter);

	// Parse JSON bodies for non-Postr routes
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	// Serve static media files
	app.use("/media", express.static(mediaPath));

	// Mount deploy-webhook before generic /api so it matches first
	app.use("/api/deploy-webhook", adaptHonoToExpress(deployWebhookRouter));

	// Apply custom routes using Hono-to-Express adapter
	app.use("/api", adaptHonoToExpress(apiRouter));
	app.use("/token", adaptHonoToExpress(tokenEndpoint));
	app.use("/background", adaptHonoToExpress(background));

	return app;
};

const app = createApp();

const isEntrypoint = process.argv[1] === fileURLToPath(import.meta.url);

if (isEntrypoint) {
	// Start Express server
	app.listen(port, () => {
		console.log(
			`Backend up and running on http://localhost:${port}, serving media from ${mediaPath}`,
		);
		console.log(`Postr routes served via Express`);
		console.log(`Custom routes adapted from Hono to Express`);
	});
}

export { app, createApp };
