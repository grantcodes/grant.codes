// Environment configuration with validation

export interface EnvConfig {
	NODE_ENV: "development" | "production" | "test";
	NEXT_PUBLIC_API_URL: string;
	NEXT_PUBLIC_URL: string;
	NEXT_PUBLIC_MEDIA_BASE_URL: string;
	NEXT_PUBLIC_AUTHOR_NAME: string;
	NEXT_PUBLIC_AUTHOR_PHOTO: string;
	NEXT_PUBLIC_AUTHOR_EMAIL: string;
	MICROPUB_TOKEN: string;
	TOKEN_SECRET: string;
	MICROPUB_ENDPOINT_PASSWORD_SERVER: string;
	TELEGRAM_CHANNEL?: string | undefined;
	TELEGRAM_TOKEN?: string | undefined;
	INSTAGRAM_USERNAME?: string | undefined;
	INSTAGRAM_PASSWORD?: string | undefined;
	INSTAGRAM_PROXY?: string | undefined;
	HUB?: string | undefined;
	COUCH_DB_PUBLIC_ADMIN?: string | undefined;
	COUCH_DB_PRIVATE_ADMIN?: string | undefined;
	DEPLOY_WEBHOOK_URL?: string | undefined;
	LINKWARDEN_URL?: string | undefined;
	LINKWARDEN_TOKEN?: string | undefined;
	LINKWARDEN_LIKES_COLLECTION_ID?: number | undefined;
	LINKWARDEN_DRY_RUN?: string | undefined;
}

function validateEnv(): EnvConfig {
	const requiredEnvVars = [
		"NEXT_PUBLIC_API_URL",
		"NEXT_PUBLIC_URL",
		"NEXT_PUBLIC_MEDIA_BASE_URL",
		"NEXT_PUBLIC_AUTHOR_NAME",
		"NEXT_PUBLIC_AUTHOR_PHOTO",
		"NEXT_PUBLIC_AUTHOR_EMAIL",
		"MICROPUB_TOKEN",
		"TOKEN_SECRET",
		"MICROPUB_ENDPOINT_PASSWORD_SERVER",
	];

	const missing = requiredEnvVars.filter((key) => !process.env[key]);

	if (missing.length > 0) {
		throw new Error(
			`Missing required environment variables: ${missing.join(", ")}`,
		);
	}

	return {
		NODE_ENV: (process.env.NODE_ENV as EnvConfig["NODE_ENV"]) || "development",
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL!,
		NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL!,
		NEXT_PUBLIC_MEDIA_BASE_URL: process.env.NEXT_PUBLIC_MEDIA_BASE_URL!,
		NEXT_PUBLIC_AUTHOR_NAME: process.env.NEXT_PUBLIC_AUTHOR_NAME!,
		NEXT_PUBLIC_AUTHOR_PHOTO: process.env.NEXT_PUBLIC_AUTHOR_PHOTO!,
		NEXT_PUBLIC_AUTHOR_EMAIL: process.env.NEXT_PUBLIC_AUTHOR_EMAIL!,
		MICROPUB_TOKEN: process.env.MICROPUB_TOKEN!,
		TOKEN_SECRET: process.env.TOKEN_SECRET!,
		MICROPUB_ENDPOINT_PASSWORD_SERVER:
			process.env.MICROPUB_ENDPOINT_PASSWORD_SERVER!,
		TELEGRAM_CHANNEL: process.env.TELEGRAM_CHANNEL,
		TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN,
		INSTAGRAM_USERNAME: process.env.INSTAGRAM_USERNAME,
		INSTAGRAM_PASSWORD: process.env.INSTAGRAM_PASSWORD,
		INSTAGRAM_PROXY: process.env.INSTAGRAM_PROXY,
		HUB: process.env.HUB,
		COUCH_DB_PUBLIC_ADMIN: process.env.COUCH_DB_PUBLIC_ADMIN,
		COUCH_DB_PRIVATE_ADMIN: process.env.COUCH_DB_PRIVATE_ADMIN,
		LINKWARDEN_URL: process.env.LINKWARDEN_URL,
		LINKWARDEN_TOKEN: process.env.LINKWARDEN_TOKEN,
		LINKWARDEN_LIKES_COLLECTION_ID: process.env.LINKWARDEN_LIKES_COLLECTION_ID
			? Number(process.env.LINKWARDEN_LIKES_COLLECTION_ID)
			: undefined,
		LINKWARDEN_DRY_RUN: process.env.LINKWARDEN_DRY_RUN,
	};
}

export const env = validateEnv();

export const isDev = env.NODE_ENV === "development";
export const isProd = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";
