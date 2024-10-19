import utils from "../utils/index.js";
import C from "./constants.js";
import Elements from "./elements.js";
import store from "./store/index.js";

/**
 * Sets up and starts the Elements library
 */
const start = (options?: {
	debug?: boolean;
	attributePrefix?: string;
}) => {
	if (Elements.started) {
		utils.log.warn(
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
	const elements = utils.elementSelectors.getAllElements();
	for (const item of elements) void store.initialiseStore(item[0], item[1]);

	utils.log.debug("library started.");
};

export default start;