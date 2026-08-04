import { destroyStore } from "../core/store/index.js";
import DEFAULT_OPTIONS from "./constants.js";
import disposeRegistration from "./dispose-registration.js";
import Catalyst from "./catalyst.js";
import { debug } from "./log.js";

const destroy = () => {
	Catalyst.removalObserver?.disconnect();
	Catalyst.removalObserver = undefined;

	const registrations = Array.from(Catalyst.registrations.values()).flatMap(
		(items) => Array.from(items.values()),
	);
	for (const registration of registrations) {
		disposeRegistration(registration);
	}

	for (const store of Array.from(Catalyst.stores.values())) {
		destroyStore(store);
	}

	Catalyst.registrations.clear();
	Catalyst.started = false;
	Catalyst.startOptions = undefined;
	Catalyst.options = DEFAULT_OPTIONS;
	debug("Library destroyed.");
};

export default destroy;
