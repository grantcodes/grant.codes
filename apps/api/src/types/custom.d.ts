// Custom type declarations for packages without TypeScript support

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
