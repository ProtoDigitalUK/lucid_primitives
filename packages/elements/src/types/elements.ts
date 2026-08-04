import type { Handler } from "./handlers.js";

export type ElementsAttributeOptions = {
	prefix?: string;
	store?: string;
	state?: string;
	scopeSeparator?: string;
	specifierSeparator?: string;
};

export type ElementsStartOptions = {
	debug?: boolean;
	handlers?: Handler[];
	attributes?: ElementsAttributeOptions;
};

export type ElementsApi = {
	start: (options?: ElementsStartOptions) => void;
	destroy: () => void;
	refresh: (targetStore?: string) => void;
	sync: (target: Element, options?: { childrenOnly?: boolean }) => void;
};
