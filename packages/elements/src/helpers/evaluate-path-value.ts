const evaluatePathValue = (value: unknown, path: readonly string[]) => {
	return path.reduce<unknown>((currentValue, part) => {
		if (currentValue === null || currentValue === undefined) return undefined;
		if (typeof currentValue !== "object") return undefined;
		return (currentValue as Record<string, unknown>)[part];
	}, value);
};

export default evaluatePathValue;
