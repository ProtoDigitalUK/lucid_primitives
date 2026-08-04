import { createRoot } from "solid-js";
import type { Store, StoreActions, StoreState } from "../../types/index.js";
import Elements from "../../runtime/elements.js";
import { debug } from "../../runtime/log.js";
import { createStateObserver, syncStateAttributes } from "../state/index.js";
import getStoreInterface from "./get-store-interface.js";

const initialiseStore = (element: Element, key: string): Store => {
	const store = createRoot((disposeRoot) => {
		const nextStore: Store = {
			key,
			element,
			initialised: false,
			state: {},
			actions: {},
			effects: { global: {}, manual: {} },
			refs: new Map(),
			stateAttributeDisposes: new Map(),
			internalStateWrites: new Map(),
			disposeRoot,
		};

		const storeModule = Elements.storeModules.get(key);
		if (storeModule) {
			const result = storeModule(
				getStoreInterface(nextStore as Store<StoreState, StoreActions>),
			);

			if (result.state) Object.assign(nextStore.state, result.state);
			if (result.actions) Object.assign(nextStore.actions, result.actions);
			if (result.effects?.global) {
				Object.assign(nextStore.effects.global, result.effects.global);
			}
			if (result.effects?.manual) {
				Object.assign(nextStore.effects.manual, result.effects.manual);
			}
			if (result.cleanup) nextStore.cleanup = result.cleanup;
		}

		syncStateAttributes(nextStore);
		nextStore.stateObserver = createStateObserver(nextStore);
		return nextStore;
	});

	Elements.stores.set(key, store);
	debug(`Store created for scope "${key}".`);
	return store;
};

export default initialiseStore;
