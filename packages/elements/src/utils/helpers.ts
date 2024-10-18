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
 * Helpers
 */
const helpers = {
	buildAttribute,
	uuid,
};

export default helpers;
