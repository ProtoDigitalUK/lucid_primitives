import log from "./log.js";
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
 * Select all bindings and handlers attributes for a given element
 */
type Attribute = [string, string];

const getElementAttributes = (
	element: HTMLElement,
): {
	state: Array<Attribute>;
	attribute: Array<Attribute>;
} => {
	if (!element.hasAttribute(helpers.buildAttribute(C.attributes.entry))) {
		log.warn(
			`The element has no "${helpers.buildAttribute(C.attributes.entry)}" attribute.`,
		);
		return {
			state: [],
			attribute: [],
		};
	}

	//* 'data-state--', 'data-bind--', 'data-handler--namespace.specifier'
	const attributes = Array.from(element.attributes);

	const statePrefix = helpers.buildAttribute(C.attributes.stateBinding);
	const attributePrefix = helpers.buildAttribute(C.attributes.attributeBinding);

	return {
		state: attributes
			.filter((attr) => attr.name.startsWith(statePrefix))
			.map(
				(attr) =>
					[attr.name.slice(statePrefix.length), attr.value] as Attribute,
			),
		attribute: attributes
			.filter((attr) => attr.name.startsWith(attributePrefix))
			.map(
				(attr) =>
					[attr.name.slice(attributePrefix.length), attr.value] as Attribute,
			),
	};
};

/**
 * Construct handler attributes
 */
// TODO: update to fn that builds tree of all handlers for given element and its children
const constructHandlerAttributes = (
	attributes: Attr[],
): Record<string, Record<string, Array<string>>> => {
	const handlerPrefix = helpers.buildAttribute(C.attributes.handler);
	const handler: Record<string, Record<string, Array<string>>> = {};

	for (const attr of attributes.filter((attr) =>
		attr.name.startsWith(handlerPrefix),
	)) {
		// TODO: add check for valid plugin namespace

		const [namespace = "", specified = ""] = attr.name
			.slice(handlerPrefix.length)
			.split(".");
		if (!namespace || !specified) continue;
		if (!handler[namespace]) {
			handler[namespace] = {};
		}
		if (!handler[namespace][specified]) {
			handler[namespace][specified] = [];
		}
		handler[namespace][specified].push(attr.value);
	}

	return handler;
};

/**
 * The Element attribute selectors
 */
const elementSelectors = {
	getAllElements,
	getElementAttributes,
};

export default elementSelectors;
