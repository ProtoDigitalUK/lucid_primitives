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
				<ul data-loop="links:$items">
					<template>
						<li>
							<a
								data-bind--href="links:$items[:index:].url"
								data-dom--text="links:$items[:index:].title"
								data-events--click="links:@select"
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
				<ul data-loop="navigation:$groups">
					<template>
						<li>
							<span data-dom--text="navigation:$groups[:index:].title"></span>
							<ul data-loop="navigation:$groups[:index:].links">
								<template>
									<li>
										<a
											data-bind--href="navigation:$groups[:index-1:].links[:index:].url"
											data-dom--text="navigation:$groups[:index-1:].links[:index:].title"
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

		const groups = Array.from(
			document.querySelectorAll("[data-loop='navigation:$groups'] > li"),
		);
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
	});
});
