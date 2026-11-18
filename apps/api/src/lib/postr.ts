import path from "node:path";
import { createPostr, type PostrPlugin } from "@postr/core";
import { feeds } from "@postr/plugin-feeds";
import { webmentionEndpoint } from "@postr/plugin-webmention-endpoint";
import { telegram } from "@postr/syndicator-telegram";
import { instagram } from "@postr/syndicator-instagram";
import { superfeedr } from "@postr/syndicator-superfeedr";
import { env, isDev, isTest } from "../config/env.js";
import { defaultPostTypes } from "./generate-search.js";

export const database =
	process.env.POSTR_DATABASE ??
	path.resolve(import.meta.dirname, "../../.data/postr.db");

export const mediaDir = path.resolve(import.meta.dirname, "../../../../media");

const grantCodes: PostrPlugin = {
	id: "grant-codes",
	postTypes: [
		{
			type: "journal",
			name: "Journal",
			discovery: (mf2) =>
				Boolean(mf2.properties.category?.includes("journal")),
		},
	],
};

const plugins: PostrPlugin[] = [
	grantCodes,
	webmentionEndpoint(),
	feeds({
		author: {
			url: env.NEXT_PUBLIC_URL,
			name: env.NEXT_PUBLIC_AUTHOR_NAME,
			photo: env.NEXT_PUBLIC_AUTHOR_PHOTO,
			email: env.NEXT_PUBLIC_AUTHOR_EMAIL,
		},
		postTypes: defaultPostTypes,
	}),
];

if (!isDev && !isTest) {
	if (env.TELEGRAM_CHANNEL && env.TELEGRAM_TOKEN) {
		plugins.push(
			telegram({ channel: env.TELEGRAM_CHANNEL, token: env.TELEGRAM_TOKEN }),
		);
	}

	if (env.INSTAGRAM_USERNAME && env.INSTAGRAM_PASSWORD) {
		plugins.push(
			instagram({
				blurBackground: true,
				username: env.INSTAGRAM_USERNAME,
				password: env.INSTAGRAM_PASSWORD,
				...(env.INSTAGRAM_PROXY ? { proxy: env.INSTAGRAM_PROXY } : {}),
			}),
		);
	}

	if (env.HUB) {
		plugins.push(superfeedr({ hub: env.HUB, topic: env.NEXT_PUBLIC_URL }));
	}
}

// TODO(production): postr 1.x live-replicated posts to two CouchDB databases
// (COUCH_DB_PUBLIC_ADMIN / COUCH_DB_PRIVATE_ADMIN) as a backup. postr 2 has no
// replication; back up `database` (a single SQLite file) instead.
export const postr = createPostr({
	siteUrl: env.NEXT_PUBLIC_URL,
	endpointUrl: `${env.NEXT_PUBLIC_API_URL}/micropub`,
	database,
	media: {
		dir: mediaDir,
		url: env.NEXT_PUBLIC_MEDIA_BASE_URL,
		imageSizes: {
			"1800": [1800],
			"700": [700],
			"200x200": [200, 200],
		},
	},
	auth: {
		// Requires IndieKey legacy mode (opaque tokens verified via GET /token).
		tokenEndpoint: "https://indiekey.id/token",
		dangerousToken: env.MICROPUB_TOKEN,
		dangerousAllowAll: isDev,
	},
	plugins,
	sendWebmentions: !isDev && !isTest,
});
