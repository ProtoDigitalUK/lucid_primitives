import type { ElementsStore } from "../../types/index.js";
import { createEffect, type Signal } from "solid-js";
import utils from "../../utils/index.js";
import type { AttributeMaps } from "../../types/index.js";

/**
 * Registers effect for each state signal
 * - Updates the state attributes for the parent and all children
 * - Updates attribute bindings
 */
const watchState = (
	element: HTMLElement,
	store: ElementsStore<Record<string, unknown>>,
) => {
	const [get] = store;
	if (!get.attributeMaps) return;

	const stateMap = get.attributeMaps?.state;
	if (!stateMap) return;

	for (const [key, signal] of Object.entries(get.state))
		registerStateEffect(element, key, signal, get.attributeMaps);
};

/**
 * Register effect for state signal updates
 * - Updates the state attributes for the parent and all children
 * - Updates attribute bindings
 */
const registerStateEffect = (
	element: HTMLElement,
	key: string,
	signal: Signal<unknown>,
	attributeMap: AttributeMaps,
) => {
	createEffect(() => {
		const value = signal[0]();
		utils.attributes.updateState(element, {
			key: key,
			value: value,
		});
		utils.attributes.updateBind(
			element,
			{
				key: key,
				value: value,
			},
			attributeMap.attribute,
		);
	});
};

/*
 * Register mutation observer for the state attributes so we have two way binding \
 * - Parses the value and updates the state signal
 * - Update the state attributes for the parent and all children
 * - Update attribute bindings
 *
 * This allows for you to update the state attributes outside of the Elements library and still have that change reflected through the library
 */
// TODO: needs to be implemented

export default watchState;
