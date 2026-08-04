import type { Store } from "../../types/index.js";
import Elements from "../../runtime/elements.js";
import registerStateAttribute from "./register-state-attribute.js";

const syncStateAttributes = (store: Store) => {
	const statePrefix = `${Elements.options.attributes.prefix}${Elements.options.attributes.state}`;

	for (const attribute of store.element.attributes) {
		if (!attribute.name.startsWith(statePrefix)) continue;
		const key = attribute.name.slice(statePrefix.length);
		if (!key) continue;
		registerStateAttribute(store, key, attribute.value);
	}
};

export default syncStateAttributes;
