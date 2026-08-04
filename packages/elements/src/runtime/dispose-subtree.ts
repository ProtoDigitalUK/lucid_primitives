import { destroyStore } from "../core/store/index.js";
import type { SyncOptions } from "../types/index.js";
import disposeRegistration from "./dispose-registration.js";
import Elements from "./elements.js";

const isWithinTarget = (
	target: Element,
	element: Element,
	options?: SyncOptions,
) => {
	if (target === element) return !options?.childrenOnly;
	return target.contains(element);
};

const disposeSubtree = (target: Element, options?: SyncOptions) => {
	const registrations = [];
	for (const [element, elementRegistrations] of Elements.registrations) {
		if (!isWithinTarget(target, element, options)) continue;
		registrations.push(...elementRegistrations.values());
	}
	for (const registration of registrations) {
		disposeRegistration(registration);
	}

	const stores = Array.from(Elements.stores.values()).filter((store) =>
		isWithinTarget(target, store.element, options),
	);
	for (const store of stores) destroyStore(store);
};

export default disposeSubtree;
