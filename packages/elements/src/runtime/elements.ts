import DEFAULT_OPTIONS from "./constants.js";
import type { ElementsRuntime } from "./types.js";

const Elements: ElementsRuntime = {
	options: DEFAULT_OPTIONS,
	started: false,
	handlers: new Map(),
	stores: new Map(),
	storeModules: new Map(),
	registrations: new Map(),
};

export default Elements;
