import C from "../core/constants.js";
import type {
	BindAttributesMap,
	HandlerAttributesMap,
	StateAttribtuesMap,
} from "../types/index.js";
import helpers from "./helpers.js";
import log from "./log.js";

/**
 * Recursively build all attribute maps for a given element
 */
const extractElementBindings = (
	element: HTMLElement,
): {
	state: StateAttribtuesMap;
	attribute: BindAttributesMap;
	handler: HandlerAttributesMap;
} => {
	if (!element.hasAttribute(helpers.buildAttribute(C.attributes.entry))) {
		log.warn(
			`The element has no "${helpers.buildAttribute(C.attributes.entry)}" attribute.`,
		);
		return {
			state: new Map(),
			attribute: new Map(),
			handler: new Map(),
		};
	}

	const attributes = collectionRecursive(element);

	const stateAttributes: StateAttribtuesMap = new Map();
	const attributeBindings: BindAttributesMap = new Map();
	const handlerAttributes: HandlerAttributesMap = new Map();

	const statePrefix = helpers.buildAttribute(C.attributes.statePrefix); //* 'data-state--'
	const bindPrefix = helpers.buildAttribute(C.attributes.attributePrefix); //* 'data-bind--'
	const handlerPrefix = helpers.buildAttribute(C.attributes.handlerPrefix); //* 'data-handler--'

	for (const attr of attributes) {
		const { name, value } = attr;

		//* for state bindings
		if (name.startsWith(statePrefix)) {
			const stateName = name.slice(statePrefix.length);
			stateAttributes.set(stateName, value);
		}
		//* for attribute bindings
		else if (name.startsWith(bindPrefix)) {
			const bindName = name.slice(bindPrefix.length);
			if (attributeBindings.has(bindName)) {
				attributeBindings.get(bindName)?.push(value);
			} else {
				attributeBindings.set(bindName, [value]);
			}
		}
		//* for handlers
		else if (name.startsWith(handlerPrefix)) {
			const handlerParts = name.slice(handlerPrefix.length).split(".");
			if (handlerParts.length === 2) {
				const [namespace, specifier] = handlerParts;
				if (!namespace || !specifier) continue;

				if (!handlerAttributes.has(namespace)) {
					handlerAttributes.set(namespace, new Map());
				}

				const namespaceMap = handlerAttributes.get(namespace);
				if (namespaceMap) {
					if (!namespaceMap.has(specifier)) {
						namespaceMap.set(specifier, []);
					}
					namespaceMap.get(specifier)?.push(value);
				}
			}
		}
	}

	return {
		state: stateAttributes,
		attribute: attributeBindings,
		handler: handlerAttributes,
	};
};

/**
 * From a given element, get all of its and its childrens attributes recursively
 */
const collectionRecursive = (element: HTMLElement): Attr[] => {
	const result: Attr[] = [];

	function traverse(el: HTMLElement) {
		result.push(...Array.from(el.attributes));
		for (const child of el.children) {
			if (child instanceof HTMLElement) {
				traverse(child);
			}
		}
	}
	traverse(element);

	return result;
};

/**
 * Attribute utils
 */
const attr = {
	extractElementBindings,
	collectionRecursive,
};

export default attr;
