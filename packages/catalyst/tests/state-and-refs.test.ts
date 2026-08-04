import { describe, expect, it } from "vitest";
import Catalyst, { storeModule } from "../src/index.js";
import Runtime from "../src/runtime/catalyst.js";
import { bind, dom, refs } from "../src/reactions.js";

const settle = async () => {
	await Promise.resolve();
	await new Promise((resolve) => setTimeout(resolve, 0));
};

describe("store state and refs", () => {
	it("keeps state attributes and bindings in sync in both directions", async () => {
		document.body.innerHTML = `
			<div data-store="state" data-state--items='[{"url":"/one"}]'>
				<a data-bind--href="$items[0].url"></a>
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

	it("uses the nearest store while preserving explicit cross-store scopes", async () => {
		document.body.innerHTML = `
			<div data-store="outer" data-state--label="Outer">
				<span id="movable" data-dom--text="$label"></span>
				<div data-store="inner" data-state--label="Inner">
					<span id="inner" data-dom--text="$label"></span>
					<span id="cross-store" data-dom--text="outer:$label"></span>
				</div>
			</div>
		`;

		Catalyst.start({ reactions: [dom] });
		await settle();
		expect(document.querySelector("#movable")?.textContent).toBe("Outer");
		expect(document.querySelector("#inner")?.textContent).toBe("Inner");
		expect(document.querySelector("#cross-store")?.textContent).toBe("Outer");

		const inner = document.querySelector('[data-store="inner"]');
		const movable = document.querySelector("#movable");
		if (!(inner instanceof Element) || !(movable instanceof Element)) {
			throw new Error("Missing inferred-scope fixtures");
		}
		inner.append(movable);
		Catalyst.sync(inner);
		await settle();
		expect(movable.textContent).toBe("Inner");
	});

	it("registers refs before the store init action", () => {
		document.body.innerHTML = `
			<div data-store="refs">
				<button data-ref="#button"></button>
				<div data-store="nested-refs">
					<span id="cross-ref" data-ref="refs:#cross"></span>
					<span id="nested-ref" data-ref="#nested"></span>
				</div>
			</div>
		`;

		let refAtInit: Element | Element[] | undefined;
		let crossRefAtInit: Element | Element[] | undefined;
		storeModule<Record<string, never>, { init: () => void }>(
			"refs",
			(store) => ({
				actions: {
					init: () => {
						refAtInit = store.refs.get("button");
						crossRefAtInit = store.refs.get("cross");
					},
				},
			}),
		);

		Catalyst.start({ reactions: [refs] });
		expect(refAtInit).toBe(document.querySelector("button"));
		expect(crossRefAtInit).toBe(document.querySelector("#cross-ref"));
		expect(Runtime.stores.get("nested-refs")?.refs.get("nested")).toBe(
			document.querySelector("#nested-ref"),
		);
	});
});
