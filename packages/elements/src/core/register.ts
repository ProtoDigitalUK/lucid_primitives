import Elements from "./elements.js";
import utils from "../utils/index.js";

/**
 * Registers plugins to Elements
 */
const register = (plugin: string) => {
	Elements.plugins.push(plugin);

	utils.log.debug(`plugin ${plugin} registered.`);
};

export default register;
