import Catalyst, { createSignal } from "@lucidclient/catalyst";
import type { StoreModule } from "@lucidclient/catalyst/types";

type NavStoreState = {
	open: boolean;
	ariaLabel: string;
};

type NavStoreActions = {
	toggle: (e: Event) => void;
	closed: () => boolean;
	buttonLabel: () => string;
	documentScroll: (e: Event) => void;
};

const navStore: StoreModule<NavStoreState, NavStoreActions> = (store) => ({
	state: {
		ariaLabel: createSignal("Open Navigation"),
	},
	actions: {
		toggle: () => {
			const [getOpen, setOpen] = store.state.open;
			const [_, setAriaLabel] = store.state.ariaLabel;

			if (getOpen()) {
				setAriaLabel("Open Navigation");
			} else {
				setAriaLabel("Close Navigation");
			}

			setOpen((prev) => !prev);
		},
		closed: () => {
			const [getOpen] = store.state.open;
			return !getOpen();
		},
		isOpen: () => {
			const [getOpen] = store.state.open;
			return getOpen();
		},
		buttonLabel: () => {
			const [getOpen] = store.state.open;
			return getOpen() ? "Close Navigation" : "Open Navigation";
		},

		replaceChild: () => {
			const target = store.refs.get("testEleRefresh");
			if (target instanceof HTMLElement) {
				target.innerHTML =
					"<button data-store='testreplace' data-state--example='false' data-events--click='nav:@newClick' data-bind--testing='nav:$open'>after<span data-bind--test='$example'>children</span></button>";
			}
			if (target && !Array.isArray(target)) {
				Catalyst.sync(target);
			}
		},
		newClick: () => {
			console.log("newClick");
		},
		oldClick: () => {
			console.log("oldClick");
		},
		documentScroll: () => {
			// console.log("document scrolled", e);
		},
	},
	effects: {
		manual: {
			customEffect: (context) => {
				const [getOpen] = store.state.open;
				console.log("effect", getOpen(), context);
			},
		},
	},
	cleanup: () => {
		console.log("CLEANEDUP");
	},
});

export default navStore;
