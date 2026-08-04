import type { Reaction } from "./reactions.js";

export type CatalystAttributeOptions = {
	prefix?: string;
	store?: string;
	state?: string;
	scopeSeparator?: string;
	specifierSeparator?: string;
};

export type CatalystStartOptions = {
	debug?: boolean;
	reactions?: Reaction[];
	attributes?: CatalystAttributeOptions;
};

export type CatalystApi = {
	start: (options?: CatalystStartOptions) => void;
	destroy: () => void;
	refresh: (targetStore?: string) => void;
	sync: (target: Element, options?: { childrenOnly?: boolean }) => void;
};
