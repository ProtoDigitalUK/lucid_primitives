export type Elements = {
	started: boolean;
	plugins: string[];
	stores: WeakMap<HTMLElement, unknown>;
};

/**
 * Stores the state of the Elements library
 */
const Elements: Elements = {
	started: false,
	plugins: [],
	stores: new WeakMap(),
};

export default Elements;
