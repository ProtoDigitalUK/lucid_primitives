import Elements from "./elements.js";
import C from "./constants.js";
import log from "../utils/log.js";

import elementSelectors from "../utils/element-selectors.js";

/**
 * Sets up and starts the Elements library
 */
const start = (options?: {
	debug?: boolean;
	attributePrefix?: string;
}) => {
	if (Elements.started) {
		log.warn(
			"The library has already been started. Please don't call start() more than once.",
		);
		return;
	}

	Elements.options = {
		debug: options?.debug ?? C.defaults.debug,
		attributePrefix: options?.attributePrefix ?? C.defaults.attributePrefix,
	};
	Elements.started = true;

	const elements = elementSelectors.getAllElements();
	for (const element of elements) {
		console.log(elementSelectors.getElementAttributes(element));
	}

	log.debug("library started.");
};

export default start;
