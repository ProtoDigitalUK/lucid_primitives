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
				data-bind--title="$label"
				data-events--click="@select"
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
		document.body.innerHTML = `
			<div data-store="scope">
				<div data-inspect--value="$key"></div>
			</div>
		`;
		const element = document.querySelector("[data-inspect--value]");
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
				if (directive.value === "$key") {
					expect(directive.reference).toMatchObject({
						type: "state",
						scope: "scope",
						key: "key",
					});
				} else {
					expect(directive.reference).toBeNull();
				}
				values.push(directive.value);
				return () => {
					cleanups += 1;
				};
			},
		};

		registerReaction(reaction);
		Catalyst.start();
		expect(values).toEqual(["$key"]);

		element?.setAttribute("data-inspect--value", "is-active");
		if (element) Catalyst.sync(element);
		expect(values).toEqual(["$key", "is-active"]);
		expect(cleanups).toBe(1);
	});

	it("keeps inferred document actions distinct across stores", () => {
		document.body.innerHTML = `
			<div data-store="first">
				<div data-events--document.catalyst-test="@run"></div>
			</div>
			<div data-store="second">
				<div data-events--document.catalyst-test="@run"></div>
			</div>
		`;
		let firstRuns = 0;
		let secondRuns = 0;
		storeModule<Record<string, never>, { run: () => void }>("first", () => ({
			actions: {
				run: () => {
					firstRuns += 1;
				},
			},
		}));
		storeModule<Record<string, never>, { run: () => void }>("second", () => ({
			actions: {
				run: () => {
					secondRuns += 1;
				},
			},
		}));

		Catalyst.start({ reactions: [events] });
		document.dispatchEvent(new Event("catalyst-test"));
		expect(firstRuns).toBe(1);
		expect(secondRuns).toBe(1);
	});

	it("can restart without registering reactions or modules again", async () => {
		storeModule<{ label: string }>("restartable", () => ({
			state: { label: createSignal("ready") },
		}));
		document.body.innerHTML = `
			<div data-store="restartable">
				<span data-dom--text="$label"></span>
			</div>
		`;

		Catalyst.start({ reactions: [dom] });
		await settle();
		expect(document.querySelector("span")?.textContent).toBe("ready");
		Catalyst.destroy();

		document.body.innerHTML = `
			<div data-store="restartable">
				<span data-dom--text="$label"></span>
			</div>
		`;
		Catalyst.start();
		await settle();

		expect(document.querySelector("span")?.textContent).toBe("ready");
	});
});
