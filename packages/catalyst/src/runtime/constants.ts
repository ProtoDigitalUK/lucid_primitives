const DEFAULT_OPTIONS = {
	debug: false,
	attributes: {
		prefix: "data-",
		store: "store",
		state: "state--",
		scopeSeparator: ":",
		specifierSeparator: "--",
	},
} as const;

export const LOOP_INDEX = ":index:";
export const LOOP_INDEX_ONE = ":indexOne:";
export default DEFAULT_OPTIONS;
