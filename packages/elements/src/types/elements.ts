import type { Store, StoreModule } from "./index.js";

export type ElementsInstance = {
	options: {
		debug: boolean;
		attributePrefix: string;
	};
	started: boolean;
	plugins: string[];
	storeModules: Map<string, StoreModule<Record<string, unknown>>>;
	stores: Map<string, Store<Record<string, unknown>>>;
	trackedElements: WeakSet<HTMLElement>;
	bodyObserver: MutationObserver;
};
