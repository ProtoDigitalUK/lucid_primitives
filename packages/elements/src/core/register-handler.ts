import utils from "../utils/index.js";
import Elements from "./elements.js";

/**
 * Registerss handlers for Elements
 */
const registerHandler = (plugin: string) => {
	Elements.plugins.push(plugin);

	utils.log.debug(`plugin ${plugin} registered.`);
};

export default registerHandler;
