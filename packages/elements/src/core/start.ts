import { createRoot } from "solid-js";
import Elements from "./elements.js";
import C from "./constants.js";
import log from "../utils/log.js";

import elementSelectors from "../utils/element-selectors.js";
import initialiseStore from "./store/initialise-store.js";

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

	// set options
	Elements.options = {
		debug: options?.debug ?? C.defaults.debug,
		attributePrefix: options?.attributePrefix ?? C.defaults.attributePrefix,
	};
	Elements.started = true;

	// initialise elements stores
	const elements = elementSelectors.getAllElements();
	for (const item of elements) void initialiseStore(item[0], item[1]);

	log.debug("library started.");
};

// TODO: read into createRoot
export default createRoot((dispose) => start);
