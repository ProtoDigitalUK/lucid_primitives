const C = {
	events: ["mouseenter", "touchstart", "focus"],
};

export default class PrefetchLinks {
	private preloaded: Set<string> = new Set();
	private supportsSpeculationRules = false;
	constructor() {
		if (!navigator.onLine) {
			console.error("The device is offline, prefetch is not allowed.");
			return;
		}
		if ("connection" in navigator) {
			const connection = navigator.connection;
			// @ts-expect-error
			if (connection?.saveData) {
				console.error("Save-Data is enabled, prefetch is not allowed.");
				return;
			}
			// @ts-expect-error
			if (/(2|3)g/.test(connection?.effectiveType)) {
				console.error(
					"2G or 3G connection is detected, prefetch is not allowed.",
				);
				return;
			}
		}

		this.supportsSpeculationRules =
			HTMLScriptElement?.supports("speculationrules");
		this.initialise();
	}
	// ----------------
	// Private methods
	private initialise() {
		this.prefetch = this.prefetch.bind(this);

		for (const event of C.events) {
			this.regEventListenerLoop(
				this.prefetchIntent,
				true,
				event as keyof HTMLElementEventMap,
				this.prefetch,
			);
		}
	}
	private regEventListenerLoop<T extends keyof HTMLElementEventMap>(
		elements: NodeListOf<HTMLElement> | null,
		register: boolean,
		event: T,
		fn: (event: HTMLElementEventMap[T]) => void,
	) {
		if (!elements) return;
		for (let i = 0; i < elements.length; i++) {
			const element = elements[i];
			if (!element) continue;

			const href = (element as HTMLAnchorElement).href;
			if (register && !this.preloaded.has(href)) {
				element.addEventListener(event, fn, { passive: true });
			} else if (!register || this.preloaded.has(href)) {
				element.removeEventListener(event, fn);
			}
		}
	}
	private removeEventListeners(element: HTMLElement) {
		for (const event of C.events) {
			element.removeEventListener(
				event as keyof HTMLElementEventMap,
				this.prefetch,
			);
		}
	}
	private shouldPreload(props: {
		href: string;
		target: string;
	}): boolean {
		try {
			const { href, target } = props;
			if (target === "_blank") return false;
			if (href.includes("mailto:")) return false;
			if (href.includes("tel:")) return false;
			if (href.includes("#")) return false;

			const url = new URL(href);
			if (url.origin !== window.location.origin) return false;
			if (url.pathname === window.location.pathname) return false;
			if (this.preloaded.has(href)) return false;

			return true;
		} catch (_) {
			return false;
		}
	}
	private prefetch(e: Event) {
		const target = e.target as HTMLAnchorElement | null;
		if (!target) return;
		if (!this.shouldPreload({ href: target.href, target: target.target }))
			return;

		if (this.supportsSpeculationRules) {
			this.addSpeculationRule(target.href);
		} else {
			this.addPrefetchLink(target.href);
		}

		this.preloaded.add(target.href);
		for (const element of this.prefetchIntent) {
			if ((element as HTMLAnchorElement).href === target.href) {
				this.removeEventListeners(element);
			}
		}
	}
	private addSpeculationRule(href: string) {
		const specScript = document.createElement("script");
		specScript.type = "speculationrules";
		const specRules = {
			prefetch: [
				{
					source: "list",
					urls: [href],
				},
			],
		};
		specScript.textContent = JSON.stringify(specRules);
		document.head.appendChild(specScript);
	}
	private addPrefetchLink(href: string) {
		const link = document.createElement("link");
		link.rel = "prefetch";
		link.href = href;
		document.head.appendChild(link);
	}
	// ----------------
	// Public methods
	destroy() {
		for (const event of C.events) {
			this.regEventListenerLoop(
				this.prefetchIntent,
				false,
				event as keyof HTMLElementEventMap,
				this.prefetch,
			);
		}
	}
	// ----------------
	// getters
	get prefetchIntent() {
		return document.querySelectorAll(
			`a[href][rel~="prefetch-intent"]`,
		) as NodeListOf<HTMLAnchorElement>;
	}
}
