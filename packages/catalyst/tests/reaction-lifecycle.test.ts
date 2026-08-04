import { createSignal } from "solid-js";
import { describe, expect, it } from "vitest";
import Catalyst, { registerReaction, storeModule } from "../src/index.js";
import { bind, dom, events } from "../src/reactions.js";
import type { Reaction } from "../src/types/index.js";

const settle = async () => {
	await Promise.resolve();
	await new Promise((resolve) => setTimeout(resolve, 0));
};

describe("reaction lifecycle", () => {
	it("initialises dynamic bindings once and disposes removed events", async () => {
		document.body.innerHTML = `
			<div data-store="dynamic">
				<div id="target"></div>
			</div>
		`;

		let setLabel: ReturnType<typeof createSignal<string>>[1] | undefined;
		let clicks = 0;
		storeModule<{ label: string }, { select: () => void }>("dynamic", () => {
			const label = createSignal("initial");
			setLabel = label[1];
			return {
				state: { label },
				actions: {
					select: () => {
						clicks += 1;
					},
				},
			};
		});

		Catalyst.start({ reactions: [bind, events] });
		const target = document.querySelector("#target");
		if (!(target instanceof HTMLElement)) throw new Error("Missing target");
		target.innerHTML = `
			<button
				data-bind--title="dynamic:$label"
				data-events--click="dynamic:@select"
			></button>
		`;
		Catalyst.sync(target);
		Catalyst.sync(target);
		await settle();

		const button = target.querySelector("button");
		expect(button?.getAttribute("title")).toBe("initial");
		button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		expect(clicks).toBe(1);

		setLabel?.("updated");
		await settle();
		expect(button?.getAttribute("title")).toBe("updated");

		button?.remove();
		await settle();
		button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		expect(clicks).toBe(1);
	});

	it("passes concrete directive data to custom reactions", () => {
		document.body.innerHTML = `<div data-inspect--value="scope:$key"></div>`;
		const element = document.querySelector("div");
		const values: string[] = [];
		let cleanups = 0;
		const reaction: Reaction = {
			name: "inspect",
			attribute: "inspect",
			setup: (directive) => {
				expect(directive.element).toBe(element);
				expect(directive.reaction).toBe("inspect");
				expect(directive.attributeName).toBe("data-inspect--value");
				expect(directive.specifier).toBe("value");
				expect(directive.synthetic).toBe(false);
				values.push(directive.value);
				return () => {
					cleanups += 1;
				};
			},
		};

		registerReaction(reaction);
		Catalyst.start();
		expect(values).toEqual(["scope:$key"]);

		element?.setAttribute("data-inspect--value", "scope:$next");
		if (element) Catalyst.sync(element);
		expect(values).toEqual(["scope:$key", "scope:$next"]);
		expect(cleanups).toBe(1);
	});

	it("can restart without registering reactions or modules again", async () => {
		storeModule<{ label: string }>("restartable", () => ({
			state: { label: createSignal("ready") },
		}));
		document.body.innerHTML = `
			<div data-store="restartable">
				<span data-dom--text="restartable:$label"></span>
			</div>
		`;

		Catalyst.start({ reactions: [dom] });
		await settle();
		expect(document.querySelector("span")?.textContent).toBe("ready");
		Catalyst.destroy();

		document.body.innerHTML = `
			<div data-store="restartable">
				<span data-dom--text="restartable:$label"></span>
			</div>
		`;
		Catalyst.start();
		await settle();

		expect(document.querySelector("span")?.textContent).toBe("ready");
	});
});
