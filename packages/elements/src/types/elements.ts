import type { ElementsStore } from "./index.js";

export type ElementsInstance = {
	options: {
		debug: boolean;
		attributePrefix: string;
	};
	started: boolean;
	plugins: string[];
	stores: Map<string, ElementsStore>;
	trackedElements: WeakSet<HTMLElement>;
	bodyObserver: MutationObserver;
};
