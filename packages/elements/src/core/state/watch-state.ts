import type { Store, StoreState, StoreActions } from "../../types/index.js";
import { createEffect, type Signal } from "solid-js";
import utils from "../../utils/index.js";
import helpers from "../../utils/helpers.js";

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
 * Register effect for state signal updates to update the state attributes
 * - If we're updating a array or object, do nothing.
 * - If we're updating a string, number, boolean, etc, we update the state attribute.
 *
 * Attribute bindings are update by the state-observer.
 */
const registerStateEffect = (
	element: HTMLElement,
	key: string,
	signal: Signal<unknown>,
) => {
	const type = helpers.valueType(signal[0]());
	if (type === "object" || type === "array") return;

	createEffect(
		() => {
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
