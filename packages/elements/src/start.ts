import Elements from "./elements.js";

/**
 * Sets up and starts the Elements library
 */
const start = () => {
	if (Elements.started) {
		console.warn(
			"Elements library has already been started. Please don't call start() more than once.",
		);
		return;
	}
	Elements.started = true;
};

export default start;
