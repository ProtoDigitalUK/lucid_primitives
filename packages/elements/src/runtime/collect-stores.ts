import { syncStateAttributes } from "../core/state/index.js";
import { initialiseStore } from "../core/store/index.js";
import type { Store, SyncOptions } from "../types/index.js";
import collectElements from "./collect-elements.js";
import Elements from "./elements.js";
import { warn } from "./log.js";

const collectStores = (target: Element, options?: SyncOptions) => {
	const stores: Store[] = [];
	const storeAttribute = `${Elements.options.attributes.prefix}${Elements.options.attributes.store}`;

	for (const element of collectElements(target, options)) {
		if (!element.hasAttribute(storeAttribute)) continue;
		const key = element.getAttribute(storeAttribute);
		if (!key) {
			warn(`The "${storeAttribute}" attribute requires a scope value.`);
			continue;
		}

		const existingStore = Elements.stores.get(key);
		if (existingStore) {
			if (existingStore.element !== element) {
				warn(`The store scope "${key}" is already used by another element.`);
				continue;
			}
			syncStateAttributes(existingStore);
			continue;
		}

		stores.push(initialiseStore(element, key));
	}

	return stores;
};

export default collectStores;
