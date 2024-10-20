import type { Store, StoreState, StoreActions } from "../../types/index.js";
import { createEffect, type Signal } from "solid-js";
import utils from "../../utils/index.js";

/**
 * Registers effect for each state signal
 * - Updates the state attributes for the parent and all children
 * - Updates attribute bindings
 */
const watchState = (
	element: HTMLElement,
	store: Store<StoreState, StoreActions>,
) => {
	for (const [key, signal] of Object.entries(store[0].state))
		registerStateEffect(element, key, signal);
};

/**
 * Register effect for state signal updates
 * - Updates the state attributes for the parent and all children
 * - Updates attribute bindings (no longer the case - the state observer does this)
 */
const registerStateEffect = (
	element: HTMLElement,
	key: string,
	signal: Signal<unknown>,
) => {
	createEffect(
		() => {
			console.log("effect ran");
			utils.attributes.updateState(element, {
				key: key,
				value: signal[0](),
			});
		},
		undefined,
		{
			name: `State key: ${key} effect`,
		},
	);
};

export default watchState;
