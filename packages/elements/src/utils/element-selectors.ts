import log from "./log.js";
import C from "../core/constants.js";

/**
 * Gets all elements with the elements attribute - stores are scoped to these elements
 */
const getAllElements = (): NodeListOf<HTMLElement> => {
	// TODO: using Elements.stores (or whatever it ends up being called), if there is a matching store for the attibute value, return that store as well as the element
	return document.querySelectorAll(`[${C.attributes.entry}]`);
};

/**
 * Select all bindings and handlers attributes for a given element
 */
const getElementAttributes = (element: HTMLElement) => {
	if (!element.hasAttribute("elements")) {
		log.warn(`The element has no "${C.attributes.entry}" attribute.`);
		return [];
	}

	const attributes = Array.from(element.attributes);

	return {
		stateBindings: attributes.filter((attr) =>
			attr.name.startsWith(C.attributes.stateBinding),
		),
		attributeBindings: attributes.filter((attr) =>
			attr.name.startsWith(C.attributes.attributeBinding),
		),
		handler: [], // TODO: use Elements.plugins to filter out all handler namespaces
	};
};

/**
 * The Element attribute selectors
 */
const elementSelectors = {
	getAllElements,
	getElementAttributes,
};

export default elementSelectors;
