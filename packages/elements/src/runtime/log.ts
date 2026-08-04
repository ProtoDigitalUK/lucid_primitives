import Elements from "./elements.js";

const prefix = "[Elements]";

export const debug = (message: string) => {
	if (Elements.options.debug) console.debug(`${prefix} ${message}`);
};

export const warn = (message: string) => console.warn(`${prefix} ${message}`);
