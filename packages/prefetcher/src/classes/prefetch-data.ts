export default class PrefetchData<T> {
	config: PrefetchDataConfig<T> | null = null;
	promise: Promise<T> | null = null;
	time: number | null = null;
	constructor(config: PrefetchDataConfig<T>) {
		this.config = config;
		this.initialise();
	}

	// ----------------
	// Private methods
	private initialise() {
		this.prefetch = this.prefetch.bind(this);
		this.click = this.click.bind(this);
		this.getTarget?.addEventListener("click", this.click);
		this.getTarget?.addEventListener("mouseover", this.prefetch);
	}
	private prefetch(e: MouseEvent) {
		if (!this.config?.fetch) return;
		if (!this.promise || this.stale) {
			this.promise = this.config.fetch();
			this.time = Date.now();
		}
	}
	private click(e: MouseEvent) {
		if (!this.config?.onClick) return;
		if (!this.promise) return;
		this.promise.then(this.config.onClick);
	}

	// ----------------
	// Public methods
	destroy() {
		this.getTarget?.removeEventListener("click", this.click);
		this.getTarget?.removeEventListener("mouseover", this.prefetch);
	}
	// ----------------
	// Getters
	get getTarget() {
		if (this.config) {
			return document.querySelector(this.config.target) as HTMLElement;
		}
		return null;
	}
	get stale() {
		if (!this.time) return false;
		if (!this.config?.staletime) return false;
		return Date.now() - this.time > this.config.staletime;
	}
}

// ----------------
// Types

interface PrefetchDataConfig<T> {
	target: string;
	fetch: () => Promise<T>;
	onClick: (res: T) => void;
	staletime?: number;
}
