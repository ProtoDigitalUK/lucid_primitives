export type LoopContext = {
	item: unknown;
	index: number;
	indexOne: number;
	parent?: LoopContext;
};

const loopContexts = new WeakMap<Element, LoopContext>();

export const setLoopContext = (element: Element, context: LoopContext) => {
	loopContexts.set(element, context);
};

export const getLoopContext = (element: Element) => {
	let current: Element | null = element;
	while (current) {
		const context = loopContexts.get(current);
		if (context) return context;
		current = current.parentElement;
	}
	return undefined;
};
