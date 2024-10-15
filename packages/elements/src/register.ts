import Elements from "./elements.js";

/**
 * Registers plugins to Elements
 */
const register = (plugin: string) => {
	Elements.plugins.push(plugin);
	console.debug(`Elements plugin ${plugin} registered.`);
};

export default register;
