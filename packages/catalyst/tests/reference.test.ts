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

	it("parses explicitly scoped actions and identifiers", () => {
		expect(parseReference("nav:@toggle")).toMatchObject({
			scope: "nav",
			type: "action",
			key: "toggle",
		});
		expect(parseReference("nav:#button[]")).toMatchObject({
			scope: "nav",
			type: "identifier",
			key: "button[]",
		});
	});

	it("parses local references without assigning a scope", () => {
		expect(parseReference("$items[0].url")).toMatchObject({
			scope: null,
			type: "state",
			key: "items",
			path: ["0", "url"],
		});
		expect(parseReference("@toggle")).toMatchObject({
			scope: null,
			type: "action",
			key: "toggle",
		});
		expect(parseReference("#button[]")).toMatchObject({
			scope: null,
			type: "identifier",
			key: "button[]",
		});
	});

	it("leaves bare values as literals", () => {
		expect(parseReference("button")).toBeNull();
		expect(parseReference("nav:button")).toBeNull();
		expect(parseReference(":$items")).toBeNull();
	});
});
