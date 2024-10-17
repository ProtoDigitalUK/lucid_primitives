export type Elements = {
	options: {
		debug: boolean;
		attributePrefix: string;
	};
	started: boolean;
	plugins: string[];
	stores: WeakMap<HTMLElement, unknown>;
};

/**
 * Stores the state of the Elements library
 */
const Elements: Elements = {
	options: {
		debug: false,
		attributePrefix: "data-",
	},
	started: false,
	plugins: [],
	stores: new WeakMap(),
};

export default Elements;
