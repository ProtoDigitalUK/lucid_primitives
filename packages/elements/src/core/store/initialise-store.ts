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

	// set or get store
	if (storeKey !== null && Elements.stores.has(storeKey)) {
		store = Elements.stores.get(storeKey) as ElementsStore;
	} else {
		// if store doesnt exist, but a storeKey was provided, warn and create a new store
		if (storeKey !== null) {
			log.warn(
				`The store with key "${storeKey}" does not exist. A new store will be created instead.`,
			);
			key = helpers.uuid();
		}

		store = createStore<ElementsStoreData>({
			initialised: false,
		}) satisfies ElementsStore;
	}

	// Set attribute data
	const [_, setStore] = store;
	setStore("attributeMaps", attr.extractElementBindings(element));

	// add store to the Elements instance and update the element key
	element.setAttribute(helpers.buildAttribute(C.attributes.entry), key);
	Elements.stores.set(key, store);

	log.debug(
		`Store initialised for element "${element.id || element.tagName}" with key "${key}"`,
	);
};

export default initialiseStore;
