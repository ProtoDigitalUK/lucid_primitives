import C from "../constants.js";
import type {
	BindAttributesMap,
	HandlerAttributesMap,
	StateAttribtuesMap,
} from "../../types/index.js";
import utils from "../../utils/index.js";

/**
 * Recursively build all attribute maps for a given element
 */
const createAttributesMap = (
	element: HTMLElement,
): {
	scope: string | null;
	state: StateAttribtuesMap;
	bind: BindAttributesMap;
	handler: HandlerAttributesMap;
} => {
	const scope =
		element.getAttribute(
			utils.helpers.buildAttribute(C.attributes.scopePrefix),
		) ?? null;
	const stateAttributes: StateAttribtuesMap = new Map();
	const bindAttributes: BindAttributesMap = new Map();
	const handlerAttributes: HandlerAttributesMap = new Map();

	if (!element.hasAttribute(utils.helpers.buildAttribute(C.attributes.entry))) {
		utils.log.warn(
			`The element has no "${utils.helpers.buildAttribute(C.attributes.entry)}" attribute.`,
		);
		return {
			scope: scope,
			state: stateAttributes,
			bind: bindAttributes,
			handler: handlerAttributes,
		};
	}

	const statePrefix = utils.helpers.buildAttribute(C.attributes.statePrefix); //* 'data-state--'
	const bindPrefix = utils.helpers.buildAttribute(C.attributes.bindPrefix); //* 'data-bind--'
	const handlerPrefix = utils.helpers.buildAttribute(
		C.attributes.handlerPrefix,
	); //* 'data-handler--'

	//* for state bindings - state can only be defined on the parent
	for (const attr of element.attributes) {
		const { name, value } = attr;
		if (name.startsWith(statePrefix)) {
			const stateName = name.slice(statePrefix.length);
			stateAttributes.set(stateName, utils.helpers.parseStateString(value));
		}
	}

	//* binds and handlers can be defined on the element or its children, these can and should be scoped if scope is defined
	for (const attr of utils.helpers.deepCollectAttr(element)) {
		const { name, value } = attr;

		//* dont track the attribute if scope is defined on the parent, but the attribute value isnt scoped:
		if (scope) {
			if (!value.startsWith(`${scope}:`)) continue;
		}

		//* for binds
		if (name.startsWith(bindPrefix)) {
			const bindName = name.slice(bindPrefix.length);

			const stateKey = utils.helpers.stateFromAttrValue(value);
			if (!bindAttributes.has(stateKey)) {
				bindAttributes.set(stateKey, new Set());
			}
			bindAttributes.get(stateKey)?.add(bindName);
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
		scope: scope,
		state: stateAttributes,
		bind: bindAttributes,
		handler: handlerAttributes,
	};
};

export default createAttributesMap;
