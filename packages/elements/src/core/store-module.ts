import type { StoreActions, StoreModule, StoreState } from "../types/index.js";
import Elements from "../runtime/elements.js";
import { warn } from "../runtime/log.js";

const storeModule = <S extends StoreState, A extends StoreActions>(
	key: string,
	module: StoreModule<S, A>,
) => {
	if (Elements.storeModules.has(key)) {
		warn(`A store module is already registered for scope "${key}".`);
		return;
	}

	Elements.storeModules.set(
		key,
		module as unknown as StoreModule<StoreState, StoreActions>,
	);
};

export default storeModule;
