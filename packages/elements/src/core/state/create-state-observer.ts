import { batch } from "solid-js";
import { parseStateString, stringifyState } from "../../helpers.js";
import type { Store } from "../../types/index.js";
import Elements from "../../runtime/elements.js";

const createStateObserver = (store: Store) => {
	const statePrefix = `${Elements.options.attributes.prefix}${Elements.options.attributes.state}`;

	const observer = new MutationObserver((mutations) => {
		batch(() => {
			for (const mutation of mutations) {
				if (mutation.type !== "attributes" || !mutation.attributeName) {
					continue;
				}

				const attributeName = mutation.attributeName;
				if (!attributeName.startsWith(statePrefix)) continue;

				const key = attributeName.slice(statePrefix.length);
				const signal = store.state[key];
				if (!signal) continue;

				const attributeValue = store.element.getAttribute(attributeName);
				const internalValue = store.internalStateWrites.get(attributeName);
				store.internalStateWrites.delete(attributeName);

				if (internalValue === attributeValue) continue;
				if (stringifyState(signal[0]()) === attributeValue) continue;

				signal[1](parseStateString(attributeValue));
			}
		});
	});

	observer.observe(store.element, {
		attributes: true,
		attributeOldValue: true,
	});

	return observer;
};

export default createStateObserver;
