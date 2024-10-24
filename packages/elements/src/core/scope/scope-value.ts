import C from "../constants.js";

/**
 * Scopes the given value with the stores provided scope
 */
const scopeAttribute = (scope: string, value: string): string =>
	`${scope}${C.seperators.scope}${value}`;

export default scopeAttribute;
