import Elements from "./elements.js";
import type { Signal } from "solid-js";
import type {
	StoreModule,
	StoreActions,
	StoreState,
	StoreData,
} from "../types/index.js";
import utils from "../utils/index.js";

/**
 * Register store module for custom state and actions
 */
const storeModule = <S extends StoreState, A extends StoreActions>(
	key: string,
	storeModule: StoreModule<S, A>,
) => {
	if (Elements.storeModules.has(key)) {
		utils.log.warn(
			`The store "${key}" already has a module registered for it.`,
		);
		return;
	}

	// @ts-expect-error - TODO: fix typing
	Elements.storeModules.set(key, storeModule);
};

export default storeModule;
