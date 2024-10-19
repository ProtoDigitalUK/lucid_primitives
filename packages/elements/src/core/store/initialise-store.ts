import { createEffect, createRoot } from "solid-js";
import { createStore, produce } from "solid-js/store";
import type { ElementsStore, ElementsStoreData } from "../../types/store.js";
import utils from "../../utils/index.js";
import store from "./index.js";
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
	let eleStore: ElementsStore<StoreState>;

	createRoot((dispose) => {
		// set or get store
		if (storeKey !== null && Elements.stores.has(storeKey)) {
			eleStore = Elements.stores.get(storeKey) as ElementsStore<StoreState>;
		} else {
			// if store doesnt exist, but a storeKey was provided, warn and create a new store
			if (storeKey !== null) {
				key = utils.helpers.uuid();
				utils.log.warn(
					`The store with key "${storeKey}" does not exist. A new store will be created instead with the key "${key}".`,
				);
			}

			eleStore = createStore<ElementsStoreData<StoreState>>({
				initialised: false,
				dispose: dispose,
				state: {},
			}) satisfies ElementsStore<StoreState>;
		}

		// set attribute data
		const [_, setStore] = eleStore;
		setStore("attributeMaps", utils.attr.buildAttributeMaps(element));

		// -----------------
		// Testing reactivity TODO: remove
		setTimeout(() => {
			setStore(
				produce((state) => {
					const signal = state.state.isdisabled;
					if (!signal) return;
					const [getIsDisabled, setIsDisabled] = signal;

					setIsDisabled("true");
				}),
			);
		}, 10000);
		// -----------------

		// create state from attribtues
		store.createState(element, eleStore);
		// create bind attributes and set values
		// pass handler namespsaces to correct plugins for them to register events / do what they need to do

		// update attribute key, add store to Elements instance and track element
		element.setAttribute(utils.helpers.buildAttribute(C.attributes.entry), key);
		Elements.stores.set(key, eleStore);
		Elements.trackedElements.add(element);

		// finished initialising
		setStore("initialised", true);

		utils.log.debug(
			`Store initialised for element "${element.id || element.tagName}" with key "${key}"`,
		);
	});
};

export default initialiseStore;
