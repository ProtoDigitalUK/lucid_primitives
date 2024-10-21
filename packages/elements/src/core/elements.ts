import type { ElementsInstance } from "../types/index.js";
import C from "./constants.js";

/**
 * Stores the state of the Elements library
 */
const Elements: ElementsInstance = {
	options: {
		debug: C.defaults.debug,
		attributePrefix: C.defaults.attributePrefix,
	},
	started: false,
	plugins: [],
	stores: new Map(),
	storeModules: new Map(),
	trackedElements: new Set(),
};

export default Elements;
