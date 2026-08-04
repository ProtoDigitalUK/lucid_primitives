import { createSignal } from "solid-js";
import { describe, expect, it } from "vitest";
import Catalyst, { storeModule } from "../src/index.js";
import { bind, dom, events, loop } from "../src/reactions.js";

const settle = async () => {
	await Promise.resolve();
	await new Promise((resolve) => setTimeout(resolve, 0));
};

describe("bindings rendered by loops", () => {
	it("runs bindings against store-module array state", async () => {
		document.body.innerHTML = `
			<div data-store="links">
				<ul data-loop="$items">
					<template>
						<li>
							<a
								data-bind--href="$item.url"
								data-bind--data-index="$index"
								data-bind--data-index-one="$indexOne"
								data-dom--text="$item.title"
								data-events--click="@select"
							></a>
						</li>
					</template>
				</ul>
			</div>
		`;

		let setItems: ReturnType<typeof createSignal<Link[]>>[1] | undefined;
		let selections = 0;
		type Link = { title: string; url: string };
		storeModule<{ items: Link[] }, { select: () => void }>("links", () => {
			const items = createSignal<Link[]>([
				{ title: "One", url: "/one" },
				{ title: "Two", url: "/two" },
			]);
			setItems = items[1];
			return {
				state: { items },
				actions: {
					select: () => {
						selections += 1;
					},
				},
			};
		});

		Catalyst.start({ reactions: [loop, bind, dom, events] });
		await settle();

		let links = Array.from(document.querySelectorAll("ul > li > a"));
		expect(links.map((link) => link.textContent)).toEqual(["One", "Two"]);
		expect(links.map((link) => link.getAttribute("href"))).toEqual([
			"/one",
			"/two",
		]);
		expect(links.map((link) => link.getAttribute("data-index"))).toEqual([
			"0",
			"1",
		]);
		expect(links.map((link) => link.getAttribute("data-index-one"))).toEqual([
			"1",
			"2",
		]);

		setItems?.([
			{ title: "One updated", url: "/one-updated" },
			{ title: "Two", url: "/two" },
			{ title: "Three", url: "/three" },
		]);
		await settle();

		links = Array.from(document.querySelectorAll("ul > li > a"));
		expect(links.map((link) => link.textContent)).toEqual([
			"One updated",
			"Two",
			"Three",
		]);
		expect(links.map((link) => link.getAttribute("href"))).toEqual([
			"/one-updated",
			"/two",
			"/three",
		]);

		links[0]?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		expect(selections).toBe(1);
	});

	it("keeps parent and child indexes isolated in nested loops", async () => {
		document.body.innerHTML = `
			<div data-store="navigation">
				<ul id="groups" data-loop="$groups">
					<template>
						<li>
							<span data-dom--text="$item.title"></span>
							<ul data-loop="$item.links">
								<template>
									<li>
										<a
											data-bind--href="$item.url"
											data-bind--data-group="$parent.item.title"
											data-bind--data-group-index="$parent.index"
											data-bind--data-group-index-one="$parent.indexOne"
											data-dom--text="$item.title"
										></a>
									</li>
								</template>
							</ul>
						</li>
					</template>
				</ul>
			</div>
		`;

		type Group = {
			title: string;
			links: { title: string; url: string }[];
		};
		storeModule<{ groups: Group[] }>("navigation", () => ({
			state: {
				groups: createSignal<Group[]>([
					{
						title: "First",
						links: [
							{ title: "One", url: "/one" },
							{ title: "Two", url: "/two" },
						],
					},
					{
						title: "Second",
						links: [{ title: "Three", url: "/three" }],
					},
				]),
			},
		}));

		Catalyst.start({ reactions: [loop, bind, dom] });
		await settle();

		const groups = Array.from(document.querySelectorAll("#groups > li"));
		expect(groups).toHaveLength(2);
		expect(
			groups.map((group) => group.querySelector("span")?.textContent),
		).toEqual(["First", "Second"]);
		expect(
			groups.map((group) =>
				Array.from(group.querySelectorAll("a")).map((link) => ({
					text: link.textContent,
					href: link.getAttribute("href"),
				})),
			),
		).toEqual([
			[
				{ text: "One", href: "/one" },
				{ text: "Two", href: "/two" },
			],
			[{ text: "Three", href: "/three" }],
		]);
		expect(
			groups.map((group) =>
				Array.from(group.querySelectorAll("a")).map((link) => ({
					group: link.getAttribute("data-group"),
					index: link.getAttribute("data-group-index"),
					indexOne: link.getAttribute("data-group-index-one"),
				})),
			),
		).toEqual([
			[
				{ group: "First", index: "0", indexOne: "1" },
				{ group: "First", index: "0", indexOne: "1" },
			],
			[{ group: "Second", index: "1", indexOne: "2" }],
		]);
	});

	it("supports item locals for action-backed loops", async () => {
		document.body.innerHTML = `
			<div data-store="action-loop">
				<ul data-loop="@getItems">
					<template>
						<li data-dom--text="$item.title"></li>
					</template>
				</ul>
			</div>
		`;

		type Item = { title: string };
		let setItems: ReturnType<typeof createSignal<Item[]>>[1] | undefined;
		storeModule<{ items: Item[] }, { getItems: () => Item[] }>(
			"action-loop",
			(store) => {
				const items = createSignal<Item[]>([{ title: "One" }]);
				setItems = items[1];
				return {
					state: { items },
					actions: { getItems: () => store.state.items[0]() },
				};
			},
		);

		Catalyst.start({ reactions: [loop, dom] });
		await settle();
		expect(
			Array.from(document.querySelectorAll("li")).map(
				(element) => element.textContent,
			),
		).toEqual(["One"]);

		setItems?.([{ title: "Two" }, { title: "Three" }]);
		await settle();
		expect(
			Array.from(document.querySelectorAll("li")).map(
				(element) => element.textContent,
			),
		).toEqual(["Two", "Three"]);
	});

	it("can traverse more than one parent loop context", async () => {
		document.body.innerHTML = `
			<div data-store="tree">
				<ul data-loop="$groups">
					<template>
						<li>
							<ul data-loop="$item.sections">
								<template>
									<li>
										<ul data-loop="$item.links">
											<template>
												<li
													data-bind--data-group="$parent.parent.item.title"
													data-bind--data-section="$parent.item.title"
													data-dom--text="$item.title"
												></li>
											</template>
										</ul>
									</li>
								</template>
							</ul>
						</li>
					</template>
				</ul>
			</div>
		`;

		storeModule<{
			groups: Array<{
				title: string;
				sections: Array<{
					title: string;
					links: Array<{ title: string }>;
				}>;
			}>;
		}>("tree", () => ({
			state: {
				groups: createSignal([
					{
						title: "Group",
						sections: [{ title: "Section", links: [{ title: "Link" }] }],
					},
				]),
			},
		}));

		Catalyst.start({ reactions: [loop, bind, dom] });
		await settle();
		const link = document.querySelector("li[data-group]");
		expect(link?.textContent).toBe("Link");
		expect(link?.getAttribute("data-group")).toBe("Group");
		expect(link?.getAttribute("data-section")).toBe("Section");
	});
});
