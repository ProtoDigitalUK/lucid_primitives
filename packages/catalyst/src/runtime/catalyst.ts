import DEFAULT_OPTIONS from "./constants.js";
import type { CatalystRuntime } from "./types.js";

const Catalyst: CatalystRuntime = {
	options: DEFAULT_OPTIONS,
	started: false,
	reactions: new Map(),
	stores: new Map(),
	storeModules: new Map(),
	registrations: new Map(),
};

export default Catalyst;
