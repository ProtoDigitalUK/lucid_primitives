import Elements from "../elements.js";
import C from "../constants.js";

/**
 * Debug logging
 */
const debug = (msg: string) =>
	Elements.debug ? console.debug(`${C.prefix} ${msg}`) : undefined;

/**
 * Warn logging
 */
const warn = (msg: string) => console.warn(`${C.prefix} ${msg}`);

/**
 * Logging object
 */
const log = {
	debug,
	warn,
};

export default log;
