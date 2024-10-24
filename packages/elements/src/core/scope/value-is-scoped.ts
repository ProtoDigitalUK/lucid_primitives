import C from "../constants.js";

/**
 * Determines if the given value is scoped or not
 */
const valueIsScoped = (scope: string, value: string): boolean =>
	value.startsWith(`${scope}${C.seperators.scope}`);

export default valueIsScoped;
