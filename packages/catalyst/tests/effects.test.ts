import { describe, expect, it } from "vitest";
import Catalyst, { storeModule } from "../src/index.js";
import Runtime from "../src/runtime/catalyst.js";
import { effects } from "../src/reactions.js";

const settle = async () => {
	await Promise.resolve();
	await new Promise((resolve) => setTimeout(resolve, 0));
};

describe("effects reaction", () => {
	it("runs global and deduplicated manual effects", async () => {
		document.body.innerHTML = `
			<div data-store="effects" data-state--count="0">
				<div data-effects="#manual"></div>
				<div data-effects="#manual"></div>
			</div>
		`;

		const globalRuns: Array<{ value: number; isInitial: boolean }> = [];
		const manualRuns: Array<{ value: number; isInitial: boolean }> = [];
		storeModule<{ count: number }, Record<string, never>>(
			"effects",
			(store) => ({
				actions: {},
				effects: {
					global: {
						global: ({ isInitial }) => {
							globalRuns.push({
								value: store.state.count[0](),
								isInitial,
							});
						},
					},
					manual: {
						manual: ({ isInitial }) => {
							manualRuns.push({
								value: store.state.count[0](),
								isInitial,
							});
						},
					},
				},
			}),
		);

		Catalyst.start({ reactions: [effects] });
		await settle();
		expect(globalRuns).toEqual([{ value: 0, isInitial: true }]);
		expect(manualRuns).toEqual([{ value: 0, isInitial: true }]);

		Runtime.stores.get("effects")?.state.count?.[1](1);
		await settle();
		expect(globalRuns.at(-1)).toEqual({ value: 1, isInitial: false });
		expect(manualRuns.at(-1)).toEqual({ value: 1, isInitial: false });
	});
});
