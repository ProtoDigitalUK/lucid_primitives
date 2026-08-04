import type { CatalystStartOptions } from "../types/index.js";
import DEFAULT_OPTIONS from "./constants.js";
import Catalyst from "./catalyst.js";
import { debug, warn } from "./log.js";
import registerReaction from "./register-reaction.js";
import registerRemovalObserver from "./register-removal-observer.js";
import sync from "./sync.js";

const start = (options?: CatalystStartOptions) => {
	if (Catalyst.started) {
		warn("Catalyst has already been started.");
		return;
	}

	Catalyst.options = {
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
	Catalyst.startOptions = options;

	for (const reaction of options?.reactions ?? []) {
		if (!Catalyst.reactions.has(reaction.name)) registerReaction(reaction);
	}

	Catalyst.started = true;
	sync(document.body);
	Catalyst.removalObserver = registerRemovalObserver();
	debug("Library started.");
};

export default start;
