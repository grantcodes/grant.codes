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
