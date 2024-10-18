import C from "../core/constants.js";
import helpers from "./helpers.js";

/**
 * Gets all elements with the elements attribute - stores are scoped to these elements
 */
const getAllElements = (): NodeListOf<HTMLElement> => {
	// TODO: using Elements.stores (or whatever it ends up being called), if there is a matching store for the attibute value, return that store as well as the element
	return document.querySelectorAll(
		`[${helpers.buildAttribute(C.attributes.entry)}]`,
	);
};

/**
 * The Element attribute selectors
 */
const elementSelectors = {
	getAllElements,
};

export default elementSelectors;
