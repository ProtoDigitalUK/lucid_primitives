import { createRoot, Signal } from "solid-js";
import { createStore } from "solid-js/store";
import type { ElementsStore, ElementsStoreData } from "../../types/store.js";
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
	let key = storeKey ?? utils.helpers.uuid();
	let store: ElementsStore<StoreState>;

	createRoot((dispose) => {
		// -----------------
		// set or get store
		if (storeKey !== null && Elements.stores.has(storeKey)) {
			store = Elements.stores.get(storeKey) as ElementsStore<StoreState>;
		} else {
			// if store doesnt exist, but a storeKey was provided, warn and create a new store
			if (storeKey !== null) {
				key = utils.helpers.uuid();
				utils.log.warn(
					`The store with key "${storeKey}" does not exist. A new store will be created instead with the key "${key}".`,
				);
			}

			store = createStore<ElementsStoreData<StoreState>>({
				initialised: false, // TODO: these will likely need to be removed depending on how user given stores are handler
				dispose: dispose,
				state: {},
			}) satisfies ElementsStore<StoreState>;
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
			if (!store[0].state.isdisabled) return;
			const [_, setIsDisabled] = store[0].state.isdisabled;
			setIsDisabled("true");
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
