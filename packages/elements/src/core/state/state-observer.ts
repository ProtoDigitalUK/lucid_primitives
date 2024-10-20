import type { Store, StoreState, StoreActions } from "../../types/index.js";
import utils from "../../utils/index.js";
import helpers from "../../utils/helpers.js";
import C from "../constants.js";

/**
 * Registers a mutation observer for all of the stores state attributes
 * - Updates all attribute bindings
 *
 * This allows for you to update the state attributes outside of the Elements library and Elements will keep it in sync with its state
 */
const stateObserver = (
	element: HTMLElement,
	store: Store<StoreState, StoreActions>,
): MutationObserver => {
	// TODO: attributeOldValue causing initial attirbute bindings to not update
	// TODO: object/array signal mutations causing infinite loop with createEffect in watch-state
	//       which job is to update the state attribute that this mutation observer is watching.

	const [get] = store;

	const statePrefix = utils.helpers.buildAttribute(C.attributes.statePrefix);

	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type === "attributes" && mutation.target.nodeType === 1) {
				const target = mutation.target as HTMLElement;
				if (!mutation.attributeName) continue;

				// get state key
				const key = mutation.attributeName.slice(statePrefix.length);
				const attributeValue = target.getAttribute(mutation.attributeName);
				if (attributeValue === mutation.oldValue) continue;

				const value = helpers.parseStateString(attributeValue);

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
		attributeOldValue: true,
		subtree: true, // TODO: if we disable registering state on children this can be set false
	});

	return observer;
};

export default stateObserver;
