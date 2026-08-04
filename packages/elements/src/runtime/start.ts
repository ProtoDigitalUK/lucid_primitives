import type { ElementsStartOptions } from "../types/index.js";
import DEFAULT_OPTIONS from "./constants.js";
import Elements from "./elements.js";
import { debug, warn } from "./log.js";
import registerHandler from "./register-handler.js";
import registerRemovalObserver from "./register-removal-observer.js";
import sync from "./sync.js";

const start = (options?: ElementsStartOptions) => {
	if (Elements.started) {
		warn("Elements has already been started.");
		return;
	}

	Elements.options = {
		debug: options?.debug ?? DEFAULT_OPTIONS.debug,
		attributes: {
			prefix: options?.attributes?.prefix ?? DEFAULT_OPTIONS.attributes.prefix,
			store: options?.attributes?.store ?? DEFAULT_OPTIONS.attributes.store,
			state: options?.attributes?.state ?? DEFAULT_OPTIONS.attributes.state,
			scopeSeparator:
				options?.attributes?.scopeSeparator ??
				DEFAULT_OPTIONS.attributes.scopeSeparator,
			specifierSeparator:
				options?.attributes?.specifierSeparator ??
				DEFAULT_OPTIONS.attributes.specifierSeparator,
		},
	};
	Elements.startOptions = options;

	for (const handler of options?.handlers ?? []) {
		if (!Elements.handlers.has(handler.name)) registerHandler(handler);
	}

	Elements.started = true;
	sync(document.body);
	Elements.removalObserver = registerRemovalObserver();
	debug("Library started.");
};

export default start;
