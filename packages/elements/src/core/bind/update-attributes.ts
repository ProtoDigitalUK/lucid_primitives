import C from "../constants.js";
import type { BindAttributesMap } from "../../types/index.js";
import utils from "../../utils/index.js";

/**
 * Updates a single element's attribute based on its binding value
 */
const resolveBindingValue = (
	element: HTMLElement | Element,
	attribute: string,
	targetKey: string,
	state: {
		key: string;
		value: unknown;
	},
	valueType: string,
	valueCache: Map<string, string>,
) => {
	const bindValue = element.getAttribute(attribute);
	if (!bindValue) return;

	let value: string;
	if (valueCache.has(bindValue)) {
		value = valueCache.get(bindValue) as string;
	} else {
		let stringifyValue: unknown;
		switch (valueType) {
			case "object": {
				stringifyValue = utils.helpers.evaluatePathValue(
					state.value as Record<string, unknown>,
					bindValue,
				);
				break;
			}
			case "array": {
				stringifyValue = utils.helpers.evaluatePathValue(
					state.value as Array<unknown>,
					bindValue,
				);
				break;
			}
			default: {
				stringifyValue = state.value;
				break;
			}
		}
		value = utils.helpers.stringifyState(stringifyValue);
		valueCache.set(bindValue, value);
	}
	element.setAttribute(targetKey, value);
};

/**
 * Updates the attribute bindings for state. Updates the target element and all children.
 */
const updateAttributes = (
	parent: HTMLElement,
	state: {
		key: string;
		value: unknown;
	},
	stateBindAttributeMap: BindAttributesMap | undefined,
) => {
	if (!stateBindAttributeMap) return;
	const affectedAttributes = stateBindAttributeMap.get(state.key);
	if (!affectedAttributes) return;

	const bindPrefix = utils.helpers.buildAttribute(C.attributes.bindPrefix);
	const valueType = utils.helpers.valueType(state.value);
	const valueCache = new Map<string, string>();

	for (const targetKey of affectedAttributes) {
		const attribute = `${bindPrefix}${targetKey}`;
		const selector = `[${attribute}^="${state.key}"]`;

		if (parent.matches(selector)) {
			resolveBindingValue(
				parent,
				attribute,
				targetKey,
				state,
				valueType,
				valueCache,
			);
		}

		for (const element of parent.querySelectorAll(selector)) {
			resolveBindingValue(
				element,
				attribute,
				targetKey,
				state,
				valueType,
				valueCache,
			);
		}
	}
};

export default updateAttributes;
