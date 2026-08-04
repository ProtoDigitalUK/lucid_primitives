import { createSignal } from "@lucidclient/catalyst";
import type { StoreModule } from "@lucidclient/catalyst/types";

const loopsStore: StoreModule<
	{
		items: Array<{
			title: string;
			url: string;
		}>;
	},
	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	{}
> = (store) => ({
	state: {
		items: createSignal([
			{ title: "title one", url: "/one" },
			{ title: "title two", url: "/two" },
			{ title: "title threee", url: "/three" },
		]),
	},
	actions: {
		init: () => {
			console.log("store", store);
		},
		childOnClick: () => {
			const [getItems, setItems] = store.state.items;
			const items = getItems();
			items.push({ title: "A new title?", url: "/new" });
			setItems([...items]);
		},
		getItems: () => {
			const [getItems] = store.state.items;
			return getItems();
		},
	},
});

export default loopsStore;
