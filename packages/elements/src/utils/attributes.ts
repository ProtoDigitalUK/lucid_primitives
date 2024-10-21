import C from "../core/constants.js";
import type {
	BindAttributesMap,
	StateBindAttributesMap,
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
	stateBindAttributes: StateBindAttributesMap;
	attribute: BindAttributesMap;
	handler: HandlerAttributesMap;
} => {
	const stateAttributes: StateAttribtuesMap = new Map();
	const stateBindAttributes: StateBindAttributesMap = new Map();
	const attributeBindings: BindAttributesMap = new Map();
	const handlerAttributes: HandlerAttributesMap = new Map();

	if (!element.hasAttribute(utils.helpers.buildAttribute(C.attributes.entry))) {
		utils.log.warn(
			`The element has no "${utils.helpers.buildAttribute(C.attributes.entry)}" attribute.`,
		);
		return {
			state: stateAttributes,
			stateBindAttributes: stateBindAttributes,
			attribute: attributeBindings,
			handler: handlerAttributes,
		};
	}

	const statePrefix = utils.helpers.buildAttribute(C.attributes.statePrefix); //* 'data-state--'
	const bindPrefix = utils.helpers.buildAttribute(C.attributes.attributePrefix); //* 'data-bind--'
	const handlerPrefix = utils.helpers.buildAttribute(
		C.attributes.handlerPrefix,
	); //* 'data-handler--'

	//* for state bindings - state can only be defined on the parent
	for (const attr of element.attributes) {
		const { name, value } = attr;
		if (name.startsWith(statePrefix)) {
			const stateName = name.slice(statePrefix.length);
			stateAttributes.set(stateName, helpers.parseStateString(value));
		}
	}

	for (const attr of deepCollectAttr(element)) {
		const { name, value } = attr;

		//* for attribute bindings
		if (name.startsWith(bindPrefix)) {
			const bindName = name.slice(bindPrefix.length);
			if (!attributeBindings.has(bindName)) {
				attributeBindings.set(bindName, new Set());
			}
			attributeBindings.get(bindName)?.add(value);

			// Update stateBindAttributes
			const stateKey = helpers.stateFromAttrValue(value);
			if (!stateBindAttributes.has(stateKey)) {
				stateBindAttributes.set(stateKey, new Set());
			}
			stateBindAttributes.get(stateKey)?.add(bindName);
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
		stateBindAttributes: stateBindAttributes,
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

	if (parent.hasAttribute(attribute)) {
		if (parent.getAttribute(attribute) !== value) {
			parent.setAttribute(attribute, value);
		}
	}

	for (const element of elements) {
		if (element.getAttribute(attribute) !== value) {
			element.setAttribute(attribute, value);
		}
	}
};

/**
 * Updates the attribute bindings for state. Updates the target element and all children.
 */

// TODO: tidy up this fn and optimise	``
const updateBind = (
	parent: HTMLElement,
	state: {
		key: string;
		value: unknown;
	},
	stateBindAttributeMap: StateBindAttributesMap | undefined,
) => {
	if (!stateBindAttributeMap) return;

	const affectedAttributes = stateBindAttributeMap.get(state.key);
	if (!affectedAttributes) return;

	const bindPrefix = utils.helpers.buildAttribute(C.attributes.attributePrefix);
	const valueType = helpers.valueType(state.value);
	const valueCache = new Map<string, string>();

	for (const targetKey of affectedAttributes) {
		const attribute = `${bindPrefix}${targetKey}`;
		const selector = `[${attribute}^="${state.key}"]`;
		// TODO: optimise this
		const elements = [
			...(parent.matches(selector) ? [parent] : []),
			...parent.querySelectorAll(selector),
		];

		for (const element of elements) {
			const bindValue = element.getAttribute(attribute);
			if (!bindValue) continue;

			let value: string;

			if (valueCache.has(bindValue)) {
				value = valueCache.get(bindValue) as string;
			} else {
				let stringifyValue: unknown;
				switch (valueType) {
					// TODO: extract this
					case "object": {
						const path = bindValue.split(".").slice(1);
						stringifyValue = path.reduce<unknown>(
							(acc, curr) =>
								acc && typeof acc === "object" && acc !== null && curr in acc
									? (acc as Record<string, unknown>)[curr]
									: undefined,
							state.value,
						);
						break;
					}
					// TODO: extract this
					case "array": {
						const match = bindValue.match(/\[(\d+)\]/);
						if (match && Array.isArray(state.value)) {
							if (match[1] === undefined) continue;
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
				value = helpers.stringifyState(stringifyValue);
				valueCache.set(bindValue, value);
			}

			element.setAttribute(targetKey, value);
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
