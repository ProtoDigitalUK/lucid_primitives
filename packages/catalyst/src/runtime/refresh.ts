import disposeSubtree from "./dispose-subtree.js";
import Catalyst from "./catalyst.js";
import { warn } from "./log.js";
import sync from "./sync.js";

const refresh = (targetStore?: string) => {
	if (!Catalyst.started) {
		warn("Catalyst must be started before it can be refreshed.");
		return;
	}

	if (targetStore) {
		const store = Catalyst.stores.get(targetStore);
		if (!store) {
			warn(`Cannot refresh unknown store "${targetStore}".`);
			return;
		}

		const target = store.element;
		disposeSubtree(target);
		sync(target);
		return;
	}

	disposeSubtree(document.body, { childrenOnly: false });
	sync(document.body);
};

export default refresh;
