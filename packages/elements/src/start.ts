import Elements from "./elements.js";
import C from "./constants.js";
import log from "./utils/log.js";

/**
 * Sets up and starts the Elements library
 */
const start = (options?: {
	debug?: boolean;
}) => {
	if (Elements.started) {
		log.warn(
			"The library has already been started. Please don't call start() more than once.",
		);
		return;
	}

	Elements.started = true;
	Elements.debug = options?.debug ?? C.defaults.debug;

	log.debug("library started.");
};

export default start;
