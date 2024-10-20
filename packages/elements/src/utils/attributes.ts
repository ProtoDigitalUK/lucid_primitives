import C from "../core/constants.js";
import type {
	BindAttributesMap,
	HandlerAttributesMap,
	StateAttribtuesMap,
} from "../types/index.js";
import helpers from "./helpers.js";
import utils from "./index.js";

/**
 * Recursively build all attribute maps for a given element
 */
const buildStoreMap = (
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

	const attributes = deepCollectAttr(element);

	const statePrefix = utils.helpers.buildAttribute(C.attributes.statePrefix); //* 'data-state--'
	const bindPrefix = utils.helpers.buildAttribute(C.attributes.attributePrefix); //* 'data-bind--'
	const handlerPrefix = utils.helpers.buildAttribute(
		C.attributes.handlerPrefix,
	); //* 'data-handler--'

	for (const attr of attributes) {
		const { name, value } = attr;

		//* for state bindings
		if (name.startsWith(statePrefix)) {
			const stateName = name.slice(statePrefix.length);
			stateAttributes.set(stateName, helpers.parseStateString(value));
		}
		//* for attribute bindings
		else if (name.startsWith(bindPrefix)) {
			const bindName = name.slice(bindPrefix.length);
			if (attributeBindings.has(bindName)) {
				attributeBindings.get(bindName)?.add(value);
			} else {
				attributeBindings.set(bindName, new Set([value]));
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
const deepCollectAttr = (element: HTMLElement): Attr[] => {
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
const updateState = (
	parent: HTMLElement,
	state: {
		key: string;
		value: unknown;
	},
) => {
	const { attribute, elements } = utils.elementSelectors.getStateElements(
		parent,
		state.key,
	);
	const value = helpers.stringifyState(state.value);

	if (parent.hasAttribute(attribute)) parent.setAttribute(attribute, value);
	for (const element of elements) {
		element.setAttribute(attribute, value);
	}
};

/**
 * Updates the attribute bindings for state. Updates the target element and all children.
 */

// TODO: this needs optimising - currently quite heavy
const updateBind = (
	parent: HTMLElement,
	state: {
		key: string;
		value: unknown;
	},
	bindAttributeMap: BindAttributesMap | undefined,
) => {
	if (!bindAttributeMap) return;
	const bindPrefix = utils.helpers.buildAttribute(C.attributes.attributePrefix);

	let stringifyValue = state.value;
	const valueType = helpers.valueType(state.value);

	for (const [targetKey, values] of bindAttributeMap) {
		for (const bindValue of values) {
			if (!bindValue.startsWith(`${state.key}`)) continue;

			switch (valueType) {
				case "object": {
					const path = bindValue.split(".").slice(1);
					if (
						path.length > 0 &&
						typeof state.value === "object" &&
						state.value !== null
					) {
						stringifyValue = path.reduce<unknown>((acc, curr) => {
							return acc &&
								typeof acc === "object" &&
								acc !== null &&
								curr in acc
								? (acc as Record<string, unknown>)[curr]
								: undefined;
						}, state.value);
					}
					break;
				}
				case "array": {
					const match = bindValue.match(/\[(\d+)\]/);
					if (match && Array.isArray(state.value)) {
						if (!match[1]) continue;
						const index = Number.parseInt(match[1], 10);
						stringifyValue =
							index < state.value.length ? state.value[index] : undefined;
					}
					break;
				}
				default: {
					stringifyValue = state.value;
					break;
				}
			}

			const attribute = `${bindPrefix}${targetKey}`;
			const selector = `[${attribute}="${bindValue}"]`;
			const value = helpers.stringifyState(stringifyValue);

			if (parent.matches(selector)) {
				parent.setAttribute(targetKey, value);
			}
			for (const element of parent.querySelectorAll(selector)) {
				element.setAttribute(targetKey, value);
			}
		}
	}
};

/**
 * Attribute utils
 */
const attributes = {
	buildStoreMap,
	deepCollectAttr,
	updateState,
	updateBind,
};

export default attributes;
