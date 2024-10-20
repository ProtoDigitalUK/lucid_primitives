import { createSignal, type Signal } from "solid-js";
import { produce } from "solid-js/store";
import type { Store } from "../../types/index.js";

/**
 * Creates a state object for the store
 * - For each state attribute in the attribute map, create a signal and add it to the state object
 */
const createState = (store: Store<Record<string, unknown>>) => {
	const [storeGet, storeSet] = store;
	const stateMap = storeGet.attributeMaps?.state;

	if (!stateMap) return;

	storeSet(
		produce((s) => {
			for (const [key, defaultValue] of stateMap.entries()) {
				s.state[key] = createSignal(defaultValue) as Signal<unknown>;
			}
		}),
	);
};

export default createState;
