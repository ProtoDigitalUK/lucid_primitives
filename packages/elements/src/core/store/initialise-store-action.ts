import type { Store } from "../../types/index.js";

const initialiseStoreAction = (store: Store) => {
	if (store.initialised) return;
	store.initialised = true;

	try {
		const result = store.actions.init?.();
		void Promise.resolve(result).catch(console.error);
	} catch (error) {
		console.error(error);
	}
};

export default initialiseStoreAction;
