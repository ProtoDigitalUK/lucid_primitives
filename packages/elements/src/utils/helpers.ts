import Elements from "../core/elements.js";

/**
 * Prepends the attribute prefix to the given attribute
 */
const buildAttribute = (attribute: string) =>
	`${Elements.options.attributePrefix}${attribute}`;

/**
 * Creates a unique* id
 */
const uuid = () => Math.random().toString(36).slice(2);

/**
 * Parses a state attribute value and returns an inferred type
 */
const parseStateString = (value: string | null) => {
	if (!value) return null;

	if (value === "true") return true;
	if (value === "false") return false;

	if (value === "null") return null;
	if (value === "undefined") return undefined;

	if (!Number.isNaN(Number(value))) return Number(value);

	if (value.trim().match(/^[{\[]/)) {
		try {
			return JSON.parse(value);
		} catch (e) {
			return value;
		}
	}

	return value;
};

/**
 * Stringifies the given state value so it can be re-attached to an attribute
 * - if the value is an object, use the bind attribute value to select the correct key's value and stringify that
 * - if the value is an array, use the bind attribute value to select the correct index's value and stringify that
 */
const stringifyState = (value: unknown): string => {
	try {
		if (typeof value === "string") return value;
		if (value === null) return "null";
		if (value === undefined) return "undefined";
		if (typeof value === "object") {
			return JSON.stringify(value);
		}
		return String(value);
	} catch (e) {
		return String(value);
	}
};

const valueType = (value: unknown) => {
	if (typeof value === "string") return "string";
	if (value === null) return "null";
	if (value === undefined) return "undefined";
	if (typeof value === "object") {
		if (Array.isArray(value)) return "array";
		return "object";
	}
	if (typeof value === "boolean") return "boolean";
	if (typeof value === "number") return "number";
	return "unknown";
};

/**
 * Works out the state key from an attribute value
 * - If the attribute value is a dot notation, return the first part
 * - If the attribute value is a bracket notation, return the first part
 */
const stateFromAttrValue = (value: string): string => {
	const dotIndex = value.indexOf(".");
	const bracketIndex = value.indexOf("[");

	if (dotIndex === -1 && bracketIndex === -1) return value;

	// dot notation first - or only present. key.test[0], key.test
	if (bracketIndex === -1 || (dotIndex !== -1 && dotIndex < bracketIndex)) {
		return value.split(".")[0] ?? value;
	}

	// bracket notation first / only present. key[0].test, key[0]
	return value.split("[")[0] ?? value;
};

/**
 * Helpers
 */
const helpers = {
	buildAttribute,
	uuid,
	parseStateString,
	stringifyState,
	valueType,
	stateFromAttrValue,
};

export default helpers;
