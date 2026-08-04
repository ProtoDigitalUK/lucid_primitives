import type { Store } from "../../types/index.js";
import Catalyst from "../../runtime/catalyst.js";
import { debug } from "../../runtime/log.js";

const destroyStore = (store: Store) => {
	store.stateObserver?.disconnect();
	for (const dispose of store.stateAttributeDisposes.values()) dispose();
	store.stateAttributeDisposes.clear();
	store.disposeRoot();
	store.cleanup?.();

	if (Catalyst.stores.get(store.key) === store) {
		Catalyst.stores.delete(store.key);
	}
	debug(`Store destroyed for scope "${store.key}".`);
};

export default destroyStore;
