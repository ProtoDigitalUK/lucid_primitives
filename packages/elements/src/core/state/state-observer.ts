import type { Store } from "../../types/index.js";
import utils from "../../utils/index.js";
import C from "../constants.js";

/**
 * Registers a mutation observer for all of the stores state attributes
 * - Updates all attribute bindings
 *
 * This allows for you to update the state attributes outside of the Elements library and Elements will keep it in sync with its state
 */
const stateObserver = (
	element: HTMLElement,
	store: Store<Record<string, unknown>>,
): MutationObserver => {
	const [get] = store;

	const statePrefix = utils.helpers.buildAttribute(C.attributes.statePrefix);

	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type === "attributes" && mutation.target.nodeType === 1) {
				const target = mutation.target as HTMLElement;

				if (!mutation.attributeName) continue;

				// get state key
				const key = mutation.attributeName.slice(statePrefix.length);
				// TODO: parse value, not necessarily a string
				const value = target.getAttribute(mutation.attributeName);

				// update state signal
				get.state[key]?.[1](value);

				// update attribute bindings
				utils.attributes.updateBind(
					target,
					{
						key: key,
						value: value,
					},
					get.attributeMaps?.attribute,
				);
			}
		}
	});

	const stateAttributes: string[] = [];
	get.attributeMaps?.state.forEach((value, key) => {
		return stateAttributes.push(`data-state--${key}`);
	});

	observer.observe(element, {
		attributes: true,
		attributeFilter: stateAttributes,
		subtree: true,
	});

	return observer;
};

export default stateObserver;
