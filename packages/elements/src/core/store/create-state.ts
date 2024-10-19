import { createSignal, createEffect, type Signal } from "solid-js";
import { produce } from "solid-js/store";
import utils from "../../utils/index.js";
import type { ElementsStore } from "../../types/index.js";

/**
 * Creates a state object for the store
 * - For each state attribute in the attribute map, create a signal and add it to the state object
 */
const createState = (
	element: HTMLElement,
	store: ElementsStore<Record<string, unknown>>,
) => {
	const [storeGet, storeSet] = store;
	const stateMap = storeGet.attributeMaps?.state;

	if (!stateMap) return; //* should never happen ? debug log?

	storeSet(
		produce((s) => {
			for (const [key, defaultValue] of stateMap.entries()) {
				const [get, set] = createSignal(defaultValue);
				s.state[key] = [get, set] as Signal<unknown>;

				// TODO: move this out to seperate function potentially? Can likley just register one effect per store for handling state updates
				createEffect(() => {
					const value = get();
					utils.attr.updateState(element, key, value);
				});
			}
		}),
	);
};

export default createState;
