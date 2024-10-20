import type { Store, StoreModule, StoreActions, StoreState } from "./index.js";

export type ElementsInstance = {
	options: {
		debug: boolean;
		attributePrefix: string;
	};
	started: boolean;
	plugins: string[];
	storeModules: Map<string, StoreModule<StoreState, StoreActions>>;
	stores: Map<string, Store<StoreState, StoreActions>>;
	trackedElements: WeakSet<HTMLElement>;
};
