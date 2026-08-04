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

export default DEFAULT_OPTIONS;
