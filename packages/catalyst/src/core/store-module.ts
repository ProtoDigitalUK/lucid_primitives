import type { StoreActions, StoreModule, StoreState } from "../types/index.js";
import Catalyst from "../runtime/catalyst.js";
import { warn } from "../runtime/log.js";

const storeModule = <S extends StoreState, A extends StoreActions>(
	key: string,
	module: StoreModule<S, A>,
) => {
	if (Catalyst.storeModules.has(key)) {
		warn(`A store module is already registered for scope "${key}".`);
		return;
	}

	Catalyst.storeModules.set(
		key,
		module as unknown as StoreModule<StoreState, StoreActions>,
	);
};

export default storeModule;
