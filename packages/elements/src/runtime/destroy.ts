import { destroyStore } from "../core/store/index.js";
import DEFAULT_OPTIONS from "./constants.js";
import disposeRegistration from "./dispose-registration.js";
import Elements from "./elements.js";
import { debug } from "./log.js";

const destroy = () => {
	Elements.removalObserver?.disconnect();
	Elements.removalObserver = undefined;

	const registrations = Array.from(Elements.registrations.values()).flatMap(
		(items) => Array.from(items.values()),
	);
	for (const registration of registrations) {
		disposeRegistration(registration);
	}

	for (const store of Array.from(Elements.stores.values())) {
		destroyStore(store);
	}

	Elements.registrations.clear();
	Elements.started = false;
	Elements.startOptions = undefined;
	Elements.options = DEFAULT_OPTIONS;
	debug("Library destroyed.");
};

export default destroy;
