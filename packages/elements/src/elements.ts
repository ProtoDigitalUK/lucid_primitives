export type Elements = {
	started: boolean;
	debug: boolean;
	plugins: string[];
	stores: WeakMap<HTMLElement, unknown>;
};

/**
 * Stores the state of the Elements library
 */
const Elements: Elements = {
	started: false,
	debug: false,
	plugins: [],
	stores: new WeakMap(),
};

export default Elements;
