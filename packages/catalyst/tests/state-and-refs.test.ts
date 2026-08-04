import { describe, expect, it } from "vitest";
import Catalyst, { storeModule } from "../src/index.js";
import Runtime from "../src/runtime/catalyst.js";
import { bind, refs } from "../src/reactions.js";

const settle = async () => {
	await Promise.resolve();
	await new Promise((resolve) => setTimeout(resolve, 0));
};

describe("store state and refs", () => {
	it("keeps state attributes and bindings in sync in both directions", async () => {
		document.body.innerHTML = `
			<div data-store="state" data-state--items='[{"url":"/one"}]'>
				<a data-bind--href="state:$items[0].url"></a>
			</div>
		`;

		Catalyst.start({ reactions: [bind] });
		await settle();
		const store = Runtime.stores.get("state");
		const root = document.querySelector('[data-store="state"]');
		const link = document.querySelector("a");
		expect(link?.getAttribute("href")).toBe("/one");

		store?.state.items?.[1]([{ url: "/two" }]);
		await settle();
		expect(root?.getAttribute("data-state--items")).toBe('[{"url":"/two"}]');
		expect(link?.getAttribute("href")).toBe("/two");

		root?.setAttribute("data-state--items", '[{"url":"/three"}]');
		await settle();
		expect(link?.getAttribute("href")).toBe("/three");
	});

	it("registers refs before the store init action", () => {
		document.body.innerHTML = `
			<div data-store="refs">
				<button data-ref="refs:button"></button>
			</div>
		`;

		let refAtInit: Element | Element[] | undefined;
		storeModule<{}, { init: () => void }>("refs", (store) => ({
			actions: {
				init: () => {
					refAtInit = store.refs.get("button");
				},
			},
		}));

		Catalyst.start({ reactions: [refs] });
		expect(refAtInit).toBe(document.querySelector("button"));
	});
});
