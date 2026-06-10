import path from "path";
import core from "@postr/core";
import webmention from "@postr/plugin-webmention-endpoint";
import feeds from "@postr/plugin-feeds";
import TelegramSyndicator from "@postr/syndicator-telegram";
import InstagramSyndicator from "@postr/syndicator-instagram";
import SuperfeedrSyndicator from "@postr/syndicator-superfeedr";
import pouchdbAdapterHttp from "pouchdb-adapter-http";
import { Hono } from "hono";
import { adaptExpressMiddleware } from "../utils/express-middleware-adapter.js";
import { env, isDev } from "../config/env.js";

// Create Postr endpoint with proper configuration
const endpoint = core({
	siteBaseUrl: env.NEXT_PUBLIC_URL,
	endpointBaseUrl: env.NEXT_PUBLIC_API_URL + "/micropub",
	dbName: path.resolve(import.meta.dirname!, "../../.data/posts"),
	mediaDir: path.resolve(import.meta.dirname!, "../../../../media"),
	mediaBaseUrl: env.NEXT_PUBLIC_MEDIA_BASE_URL,
	tokenEndpoint: env.NEXT_PUBLIC_API_URL + `/token`,
	imageSizes: {
		1800: [1800, 0],
		700: [700, 0],
		"200x200": [200, 200],
	},
	formatContent: true,
	getRefs: true,
	downloadExternalMedia: true,
	createdDateInPermalinks: true,
	dangerousDevMode: isDev,
	dangerousPermanentToken: env.MICROPUB_TOKEN,
	dbPassword: env.MICROPUB_ENDPOINT_PASSWORD_SERVER,
	sendWebmentions: !isDev,
});

// Use plugins
endpoint.use(webmention);
endpoint.use(feeds, {
	hCard: {
		type: ["h-card"],
		properties: {
			url: [env.NEXT_PUBLIC_URL],
			name: [env.NEXT_PUBLIC_AUTHOR_NAME],
			photo: [env.NEXT_PUBLIC_AUTHOR_PHOTO],
			email: [env.NEXT_PUBLIC_AUTHOR_EMAIL],
		},
	},
});

// Use syndicator plugins
if (!isDev) {
	if (env.TELEGRAM_CHANNEL && env.TELEGRAM_TOKEN) {
		endpoint.use(TelegramSyndicator, {
			channel: env.TELEGRAM_CHANNEL,
			token: env.TELEGRAM_TOKEN,
		});
	}

	if (env.INSTAGRAM_USERNAME && env.INSTAGRAM_PASSWORD) {
		endpoint.use(InstagramSyndicator, {
			blurBackground: true,
			username: env.INSTAGRAM_USERNAME,
			password: env.INSTAGRAM_PASSWORD,
			proxy: env.INSTAGRAM_PROXY,
		});
	}

	if (env.HUB) {
		endpoint.use(SuperfeedrSyndicator, {
			hub: env.HUB,
			domain: env.NEXT_PUBLIC_URL,
		});
	}
}

// Add custom journal post type
endpoint.addPostType({
	id: "journal",
	name: "Journal",
	discovery: (mf2: any) =>
		mf2.properties.category && mf2.properties.category.includes("journal"),
});

// Syndicate and replicate to a couchdb database when on live site
if (env.COUCH_DB_PUBLIC_ADMIN && env.COUCH_DB_PRIVATE_ADMIN) {
	console.log("Starting replication");
	endpoint.use(pouchdbAdapterHttp);

	endpoint
		.getCollection()
		.then((collection: any) => {
			// RxDB registers multiple "destroyed" listeners on the underlying PouchDB instance
			// (database + collection + middleware + sync). With two sync jobs running, this exceeds
			// Node's default MaxListeners of 10. Set a higher limit to suppress the warning.
			if (collection.pouch) {
				collection.pouch.setMaxListeners(20);
			}

			const publicSyncOptions = {
				remote: env.COUCH_DB_PUBLIC_ADMIN!,
				direction: {
					pull: true,
					push: !isDev,
				},
				options: {
					live: true,
					retry: true,
				},
				query: collection.find().where("properties.visibility.0").ne("private"), // Don't sync private posts to this database
			};

			const privateSyncOptions = {
				remote: env.COUCH_DB_PRIVATE_ADMIN!,
				direction: {
					pull: true,
					push: !isDev,
				},
				options: {
					live: true,
					retry: true,
				},
				query: collection.find().where("properties.visibility.0").eq("private"), // Only sync private posts to this database
			};

			// Sync public
			collection.sync(publicSyncOptions);

			// Sync private
			if (!isDev) {
				collection.sync(privateSyncOptions);
			}
		})
		.catch((err: any) => console.error("Error setting up replication", err));
}

// Create a Hono router that wraps the Express-based Postr endpoint
const postrRouter = new Hono();

// The Postr endpoint is an Express application, so we need to adapt it
// to work with Hono by treating it as Express middleware
postrRouter.use("*", adaptExpressMiddleware(endpoint.router));

// Export both the endpoint and the Hono router for compatibility
export const postr = {
	...endpoint,
	router: postrRouter,
	expressRouter: endpoint.router, // Keep the original Express router
	// Keep the original endpoint methods
	getCollection: endpoint.getCollection,
	use: endpoint.use,
	addPostType: endpoint.addPostType,
};
