const stringifyState = (value: unknown): string => {
	try {
		if (typeof value === "string") return value;
		if (value === null) return "null";
		if (value === undefined) return "undefined";
		if (typeof value === "object") return JSON.stringify(value);
		return String(value);
	} catch {
		return String(value);
	}
};

export default stringifyState;
