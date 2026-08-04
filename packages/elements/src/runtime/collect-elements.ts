import type { SyncOptions } from "../types/index.js";

const collectElements = (target: Element, options?: SyncOptions) => {
	const elements: Element[] = [];
	if (!options?.childrenOnly) elements.push(target);
	elements.push(...target.querySelectorAll("*"));
	return elements;
};

export default collectElements;
