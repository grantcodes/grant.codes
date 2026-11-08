// Custom type declarations for packages without TypeScript support

declare module "@postr/core" {
	export interface PostrConfig {
		siteBaseUrl: string;
		endpointBaseUrl: string;
		dbName: string;
		mediaDir: string;
		mediaBaseUrl: string;
		tokenEndpoint: string;
		imageSizes?: Record<string, [number, number]>;
		formatContent?: boolean;
		getRefs?: boolean;
		downloadExternalMedia?: boolean;
		createdDateInPermalinks?: boolean;
		dangerousDevMode?: boolean;
		dangerousPermanentToken?: string;
		dbPassword?: string;
		sendWebmentions?: boolean;
	}

	export interface PostrEndpoint {
		router: any; // Express router for now
		getCollection(): Promise<any>;
		use(plugin: any, config?: any): void;
		addPostType(config: any): void;
	}

	export default function createPostr(config: PostrConfig): PostrEndpoint;
}

declare module "@postr/plugin-feeds" {
	export interface FeedsConfig {
		hCard?: {
			type: string[];
			properties: {
				url: string[];
				name: string[];
				photo: string[];
				email: string[];
			};
		};
	}

	export default function feedsPlugin(config?: FeedsConfig): any;
}

declare module "@postr/plugin-webmention-endpoint" {
	export default function webmentionPlugin(): any;
}

declare module "@postr/syndicator-instagram" {
	export interface InstagramConfig {
		blurBackground?: boolean;
		username: string;
		password: string;
		proxy?: string;
	}

	export default function InstagramSyndicator(config: InstagramConfig): any;
}

declare module "@postr/syndicator-superfeedr" {
	export interface SuperfeedrConfig {
		hub: string;
		domain: string;
	}

	export default function SuperfeedrSyndicator(config: SuperfeedrConfig): any;
}

declare module "@postr/syndicator-telegram" {
	export interface TelegramConfig {
		channel: string;
		token: string;
	}

	export default function TelegramSyndicator(config: TelegramConfig): any;
}

declare module "@postr/core/lib/middlewear/auth.js" {
	export default function authMiddleware(
		req: any,
		res: any,
		next: (err?: Error) => void
	): void;
}

declare module "@grantcodes/themer" {
	export interface Theme {
		gradient: string[];
	}

	export function daily(): Theme;
	export function fromColor(color: string): Theme;
}

declare module "pluralize" {
	export function plural(word: string): string;
	export function singular(word: string): string;
	export function isPlural(word: string): boolean;
	export function isSingular(word: string): boolean;
	export function addPluralRule(
		rule: string | RegExp,
		replacement: string,
	): void;
	export function addSingularRule(
		rule: string | RegExp,
		replacement: string,
	): void;
	export function addUncountableRule(rule: string | RegExp): void;
	export function addIrregularRule(single: string, plural: string): void;
}

declare module "indieauth-helper" {
	export interface IndieAuthConfig {
		me: string;
		clientId: string;
		redirectUri: string;
		scope: string;
		state?: string;
	}

	export function generateAuthUrl(config: IndieAuthConfig): string;
	export function validateAuthResponse(params: any): Promise<any>;
}

declare module "pouchdb-adapter-http" {
	export default function httpAdapter(): any;
}

declare module "node-schedule" {
	export interface Job {
		cancel(): boolean;
		reschedule(spec: any): boolean;
		nextInvocation(): Date | null;
	}

	export function scheduleJob(
		name: string,
		rule: string | Date,
		job: () => void,
	): Job;
	export function scheduleJob(rule: string | Date, job: () => void): Job;
	export function cancelJob(job: Job | string): boolean;
	export function cancelAllJobs(): void;
	export function getJob(name: string): Job | null;
	export function getJobs(): Record<string, Job>;
	export function rescheduleJob(job: Job | string, spec: any): boolean;
	export function nextInvocation(job: Job | string): Date | null;
}
