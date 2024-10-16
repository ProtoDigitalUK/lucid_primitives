import Elements from "./elements.js";
import log from "../utils/log.js";

/**
 * Registers plugins to Elements
 */
const register = (plugin: string) => {
	Elements.plugins.push(plugin);

	log.debug(`plugin ${plugin} registered.`);
};

export default register;
