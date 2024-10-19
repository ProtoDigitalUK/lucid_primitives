import C from "../core/constants.js";
import type {
	BindAttributesMap,
	HandlerAttributesMap,
	StateAttribtuesMap,
} from "../types/index.js";
import utils from "./index.js";

/**
 * Recursively build all attribute maps for a given element
 */
const buildAttributeMaps = (
	element: HTMLElement,
): {
	state: StateAttribtuesMap;
	attribute: BindAttributesMap;
	handler: HandlerAttributesMap;
} => {
	const stateAttributes: StateAttribtuesMap = new Map();
	const attributeBindings: BindAttributesMap = new Map();
	const handlerAttributes: HandlerAttributesMap = new Map();

	if (!element.hasAttribute(utils.helpers.buildAttribute(C.attributes.entry))) {
		utils.log.warn(
			`The element has no "${utils.helpers.buildAttribute(C.attributes.entry)}" attribute.`,
		);
		return {
			state: stateAttributes,
			attribute: attributeBindings,
			handler: handlerAttributes,
		};
	}

	const attributes = deepCollectAttributes(element);

	const statePrefix = utils.helpers.buildAttribute(C.attributes.statePrefix); //* 'data-state--'
	const bindPrefix = utils.helpers.buildAttribute(C.attributes.attributePrefix); //* 'data-bind--'
	const handlerPrefix = utils.helpers.buildAttribute(
		C.attributes.handlerPrefix,
	); //* 'data-handler--'

	for (const attr of attributes) {
		const { name, value } = attr;

		//* for state bindings
		if (name.startsWith(statePrefix)) {
			const stateName = name.slice(statePrefix.length).toLowerCase();
			stateAttributes.set(stateName, value);
		}
		//* for attribute bindings
		else if (name.startsWith(bindPrefix)) {
			const bindName = name.slice(bindPrefix.length).toLowerCase();
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
const deepCollectAttributes = (element: HTMLElement): Attr[] => {
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
 * Updates the state attribute for the given element and its children where theere exists a `data-state--{key}` attribute
 */
const updateState = (parent: HTMLElement, key: string, value: unknown) => {
	const { attribute, elements } = utils.elementSelectors.getStateElements(
		parent,
		key,
	);

	for (const element of elements) {
		element.setAttribute(attribute, value as string);
	}
	if (parent.hasAttribute(attribute))
		parent.setAttribute(attribute, value as string);
};

/**
 * Attribute utils
 */
const attr = {
	buildAttributeMaps,
	deepCollectAttributes,
	updateState,
};

export default attr;
