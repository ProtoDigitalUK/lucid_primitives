import Elements from "../elements.js";

/**
 * Scopes the given value with the stores provided scope
 */
const scopeAttribute = (scope: string, value: string): string =>
	`${scope}${Elements.options.attributes.seperators.scope}${value}`;

export default scopeAttribute;
