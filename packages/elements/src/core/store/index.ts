import initialiseStore from "./initialise-store.js";
import registerStoreObserver from "./remove-store-observer.js";
import createAttributesMap from "./create-attributes-map.js";
import getStoreInterface from "./get-store-interface.js";

const store = {
	initialiseStore,
	registerStoreObserver,
	createAttributesMap,
	getStoreInterface,
};

export default store;
