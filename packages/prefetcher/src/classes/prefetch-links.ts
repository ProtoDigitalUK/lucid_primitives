const attributes = {
	prefetch: "data-prefetch",
};

export default class PrefetchLinks {
	attribute: string;
	constructor(attribute?: string) {
		this.attribute = attribute || attributes.prefetch;
		this.initialise();
	}
	// ----------------
	// Private methods
	private initialise() {
		this.prefetch = this.prefetch.bind(this);

		this.regEventListenerLoop(
			this.anchorElements,
			true,
			"mouseover",
			this.prefetch,
		);
	}
	private regEventListenerLoop<T extends keyof HTMLElementEventMap>(
		elements: NodeListOf<HTMLElement> | null,
		register: boolean,
		event: T,
		fn: (event: HTMLElementEventMap[T]) => void,
	) {
		if (!elements) return;
		for (let i = 0; i < elements.length; i++) {
			if (register) elements[i]?.addEventListener<T>(event, fn);
			else elements[i]?.removeEventListener<T>(event, fn);
		}
	}
	private prefetch(e: MouseEvent) {
		const href = (e.target as HTMLAnchorElement).href;

		if (!href) return;
		if (href.includes("mailto:")) return;
		if (href.includes("tel:")) return;
		if (href.includes("#")) return;
		if (href === window.location.href) return;

		const prefetchLink = document.querySelector(`link[href="${href}"]`);
		if (prefetchLink) return;

		const link = document.createElement("link");
		link.rel = "prefetch";
		link.href = href;
		document.head.appendChild(link);
	}
	// ----------------
	// Public methods
	destroy() {
		this.regEventListenerLoop(
			this.anchorElements,
			false,
			"mouseover",
			this.prefetch,
		);
	}
	// ----------------
	// getters
	get anchorElements() {
		return document.querySelectorAll(
			`a[${this.attribute}]`,
		) as NodeListOf<HTMLAnchorElement>;
	}
}
