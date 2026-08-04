import { createEffect, createRoot } from "solid-js";
import { createSignal } from "solid-js";
import { parseStateString, stringifyState } from "../../helpers.js";
import type { Store } from "../../types/index.js";
import Elements from "../../runtime/elements.js";

const registerStateAttribute = (
	store: Store,
	key: string,
	initialValue: string | null,
) => {
	if (!store.state[key]) {
		store.state[key] = createSignal(parseStateString(initialValue));
	}

	if (store.stateAttributeDisposes.has(key)) return;

	const attributeName = `${Elements.options.attributes.prefix}${Elements.options.attributes.state}${key}`;
	const signal = store.state[key];
	if (!signal) return;

	const dispose = createRoot((disposeRoot) => {
		createEffect(() => {
			const value = stringifyState(signal[0]());
			if (store.element.getAttribute(attributeName) === value) return;

			store.internalStateWrites.set(attributeName, value);
			store.element.setAttribute(attributeName, value);
		});
		return disposeRoot;
	});

	store.stateAttributeDisposes.set(key, dispose);
};

export default registerStateAttribute;
