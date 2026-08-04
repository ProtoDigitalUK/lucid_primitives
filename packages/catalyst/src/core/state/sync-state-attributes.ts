import type { Store } from "../../types/index.js";
import Catalyst from "../../runtime/catalyst.js";
import registerStateAttribute from "./register-state-attribute.js";

const syncStateAttributes = (store: Store) => {
	const statePrefix = `${Catalyst.options.attributes.prefix}${Catalyst.options.attributes.state}`;

	for (const attribute of store.element.attributes) {
		if (!attribute.name.startsWith(statePrefix)) continue;
		const key = attribute.name.slice(statePrefix.length);
		if (!key) continue;
		registerStateAttribute(store, key, attribute.value);
	}
};

export default syncStateAttributes;
