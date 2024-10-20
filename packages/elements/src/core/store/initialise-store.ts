import { createRoot } from "solid-js";
import { createStore } from "solid-js/store";
import type { Store, StoreData, StoreModule } from "../../types/store.js";
import utils from "../../utils/index.js";
import state from "../state/index.js";
import C from "../constants.js";
import Elements from "../elements.js";

// TODO: might be able to do type generation for this based on attribute maps and infered value type?
// - Doesnt strictly matter here as its internal, but for the public API for creating a store this would be nice for having the correct at least
//   for the state attributes
type StoreState = Record<string, unknown>;

/**
 * Creates a store for the given element if one hasnt already been specified.
 * - Populates the store with attribute maps.
 */
const initialiseStore = (element: HTMLElement, storeKey: string | null) => {
	const key = storeKey ?? utils.helpers.uuid();

	createRoot((dispose) => {
		// -----------------
		// sreate store
		const store = createStore<StoreData<StoreState>>({
			initialised: false,
			dispose: dispose,
			state: {},
			actions: {},
		}) satisfies Store<StoreState>;

		// get store module and update the store
		console.log(Elements.storeModules);
		if (storeKey !== null && Elements.storeModules.has(storeKey)) {
			const storeModuleFn = Elements.storeModules.get(
				storeKey,
			) as StoreModule<StoreState>; // wrong generic type - doesnt matter currently
			const storeModule = storeModuleFn(store[0]);

			utils.log.debug(`Store module found for key "${storeKey}"`);

			if (storeModule.state) store[1]("state", storeModule.state);
			if (storeModule.actions) store[1]("actions", storeModule.actions);
		}

		// -----------------
		// set data
		element.setAttribute(utils.helpers.buildAttribute(C.attributes.entry), key);
		store[1]("attributeMaps", utils.attributes.buildStoreMap(element));

		// -----------------
		// handle state, attribute bindings and handlers
		state.createState(store);
		state.watchState(element, store);
		// state effects
		// attribute bindings
		// handlers

		// TODO: temp testing
		setTimeout(() => {
			// if (!store[0].state.isdisabled) return;
			// const [_, setIsDisabled] = store[0].state.isdisabled;
			// setIsDisabled("true");
			store[0].actions.handleClick?.();
		}, 4000);

		// -----------------
		// update Elements instance
		Elements.stores.set(key, store);
		Elements.trackedElements.add(element);

		store[1]("initialised", true);

		utils.log.debug(
			`Store initialised for element "${element.id || element.tagName}" with key "${key}"`,
		);
	});
};

export default initialiseStore;
