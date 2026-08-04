import { describe, expect, it } from "vitest";
import { parseReference } from "../src/helpers.js";

describe("parseReference", () => {
	it("parses nested state paths", () => {
		expect(parseReference("links:$items[2].url")).toEqual({
			raw: "links:$items[2].url",
			scope: "links",
			type: "state",
			key: "items",
			path: ["2", "url"],
		});
	});

	it("parses actions and identifiers", () => {
		expect(parseReference("nav:@toggle")).toMatchObject({
			scope: "nav",
			type: "action",
			key: "toggle",
		});
		expect(parseReference("nav:button[]")).toMatchObject({
			scope: "nav",
			type: "identifier",
			key: "button[]",
		});
	});

	it("rejects unscoped values", () => {
		expect(parseReference("$items")).toBeNull();
	});
});
