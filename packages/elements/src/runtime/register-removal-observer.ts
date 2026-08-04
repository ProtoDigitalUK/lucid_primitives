import disposeSubtree from "./dispose-subtree.js";

const registerRemovalObserver = () => {
	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			for (const node of mutation.removedNodes) {
				if (!(node instanceof Element)) continue;
				if (document.documentElement.contains(node)) continue;
				disposeSubtree(node);
			}
		}
	});

	observer.observe(document.body, { childList: true, subtree: true });
	return observer;
};

export default registerRemovalObserver;
