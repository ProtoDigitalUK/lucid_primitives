import C from "../constants.js";
import utils from "../../utils/index.js";

/**
 * Updates the state attribute for the given element if the value has changed
 */
const updateAttributes = (
	element: HTMLElement,
	state: {
		key: string;
		value: unknown;
	},
) => {
	const statePrefix = utils.helpers.buildAttribute(C.attributes.statePrefix); //* 'data-state--'

	const attribute = statePrefix + state.key;
	const value = utils.helpers.stringifyState(state.value);

	if (element.hasAttribute(attribute)) {
		if (element.getAttribute(attribute) !== value) {
			element.setAttribute(attribute, value);
		}
	}
};

export default updateAttributes;
