import type { ElementsStoreData } from "../types/index.js";

/**
 * Register store actions and state
 */
const store = <T extends Record<string, unknown>>(
	key: string,
	store: (instance: ElementsStoreData<T>) => {
		state: Record<string, unknown>;
		actions: Record<string, (...args: unknown[]) => unknown>;
	},
) => {
	console.log(key);
	console.log(store);
};

export default store;
