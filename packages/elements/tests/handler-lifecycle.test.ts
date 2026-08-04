import { createSignal } from "solid-js";
import { describe, expect, it } from "vitest";
import Elements, { storeModule } from "../src/index.js";
import { standardHandlers } from "../src/handlers.js";
import type { Handler } from "../src/types/index.js";

const settle = async () => {
	await Promise.resolve();
	await new Promise((resolve) => setTimeout(resolve, 0));
};

describe("handler lifecycle", () => {
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

		Elements.start({ handlers: standardHandlers });
		const target = document.querySelector("#target");
		if (!(target instanceof HTMLElement)) throw new Error("Missing target");
		target.innerHTML = `
			<button
				data-bind--title="dynamic:$label"
				data-events--click="dynamic:@select"
			></button>
		`;
		Elements.sync(target);
		Elements.sync(target);
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

	it("passes concrete directive data to custom handlers", () => {
		document.body.innerHTML = `<div data-inspect--value="scope:$key"></div>`;
		const element = document.querySelector("div");
		const values: string[] = [];
		let cleanups = 0;
		const handler: Handler = {
			name: "inspect",
			attribute: "inspect",
			setup: (directive) => {
				expect(directive.element).toBe(element);
				expect(directive.specifier).toBe("value");
				values.push(directive.value);
				return () => {
					cleanups += 1;
				};
			},
		};

		Elements.start({ handlers: [handler] });
		expect(values).toEqual(["scope:$key"]);

		element?.setAttribute("data-inspect--value", "scope:$next");
		if (element) Elements.sync(element);
		expect(values).toEqual(["scope:$key", "scope:$next"]);
		expect(cleanups).toBe(1);
	});

	it("can restart without registering handlers or modules again", async () => {
		storeModule<{ label: string }>("restartable", () => ({
			state: { label: createSignal("ready") },
		}));
		document.body.innerHTML = `
			<div data-store="restartable">
				<span data-dom--text="restartable:$label"></span>
			</div>
		`;

		Elements.start({ handlers: standardHandlers });
		await settle();
		expect(document.querySelector("span")?.textContent).toBe("ready");
		Elements.destroy();

		document.body.innerHTML = `
			<div data-store="restartable">
				<span data-dom--text="restartable:$label"></span>
			</div>
		`;
		Elements.start();
		await settle();

		expect(document.querySelector("span")?.textContent).toBe("ready");
	});
});
