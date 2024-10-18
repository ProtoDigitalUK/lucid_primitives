import { createRoot } from "solid-js";
import { createStore } from "solid-js/store";
import Elements from "../elements.js";
import C from "../constants.js";
import log from "../../utils/log.js";
import helpers from "../../utils/helpers.js";
import attr from "../../utils/attr.js";
import type { ElementsStore, ElementsStoreData } from "../../types/store.js";

/**
 * Creates a store for the given element if one hasnt already been specified.
 * - Populates the store with attribute maps.
 */
const initialiseStore = (element: HTMLElement, storeKey: string | null) => {
	let key = storeKey ?? helpers.uuid();
	let store: ElementsStore;

	createRoot((dispose) => {
		// set or get store
		if (storeKey !== null && Elements.stores.has(storeKey)) {
			store = Elements.stores.get(storeKey) as ElementsStore;
		} else {
			// if store doesnt exist, but a storeKey was provided, warn and create a new store
			if (storeKey !== null) {
				key = helpers.uuid();
				log.warn(
					`The store with key "${storeKey}" does not exist. A new store will be created instead with the key "${key}".`,
				);
			}

			store = createStore<ElementsStoreData>({
				initialised: false,
				dispose: dispose,
			}) satisfies ElementsStore;
		}

		// set attribute data
		const [_, setStore] = store;
		setStore("attributeMaps", attr.extractElementBindings(element));

		// create state from attribtues
		// create bind attributes and set values
		// pass handler namespsaces to correct plugins for them to register events / do what they need to do

		// update attribute key, add store to Elements instance and track element
		element.setAttribute(helpers.buildAttribute(C.attributes.entry), key);
		Elements.stores.set(key, store);
		Elements.trackedElements.add(element);

		// finished initialising
		setStore("initialised", true);

		log.debug(
			`Store initialised for element "${element.id || element.tagName}" with key "${key}"`,
		);
	});
};

export default initialiseStore;
