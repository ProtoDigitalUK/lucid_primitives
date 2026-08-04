import disposeSubtree from "./dispose-subtree.js";
import Elements from "./elements.js";
import { warn } from "./log.js";
import sync from "./sync.js";

const refresh = (targetStore?: string) => {
	if (!Elements.started) {
		warn("Elements must be started before it can be refreshed.");
		return;
	}

	if (targetStore) {
		const store = Elements.stores.get(targetStore);
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
