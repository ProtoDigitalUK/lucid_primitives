import Elements from "./elements.js";
import type { StoreModule } from "../types/index.js";
import utils from "../utils/index.js";

/**
 * Register store module for custom state and actions
 */
const storeModule = <T extends Record<string, unknown>>(
	key: string,
	storeModule: StoreModule<T>,
) => {
	if (Elements.storeModules.has(key)) {
		utils.log.warn(
			`The store "${key}" already has a module registered for it.`,
		);
		return;
	}

	// @ts-expect-error
	Elements.storeModules.set(key, storeModule); // TODO: fix typing
};

export default storeModule;
