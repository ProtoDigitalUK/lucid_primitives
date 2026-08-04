import type { Reaction } from "../../types/index.js";
import createResolvedEffect from "../utils/create-resolved-effect.js";

type ActiveTrap = {
	previousActiveElement: HTMLElement | null;
	siblings: HTMLElement[];
};

const activeTraps = new Map<HTMLElement, ActiveTrap>();

const getSiblings = (target: HTMLElement) => {
	return Array.from(document.body.children).filter(
		(element): element is HTMLElement =>
			element instanceof HTMLElement &&
			element !== target &&
			!element.contains(target) &&
			!target.contains(element),
	);
};

const releaseTrap = (target: HTMLElement, inertWhenInactive: boolean) => {
	const activeTrap = activeTraps.get(target);
	if (activeTrap) {
		for (const sibling of activeTrap.siblings) sibling.removeAttribute("inert");
		activeTraps.delete(target);
		if (activeTraps.size === 0) {
			document.body.style.overflow = "";
			activeTrap.previousActiveElement?.focus();
		}
	}

	if (inertWhenInactive) target.setAttribute("inert", "");
};

const activateTrap = (target: HTMLElement) => {
	if (activeTraps.has(target)) return;
	const siblings = getSiblings(target);
	activeTraps.set(target, {
		previousActiveElement:
			document.activeElement instanceof HTMLElement
				? document.activeElement
				: null,
		siblings,
	});
	for (const sibling of siblings) sibling.setAttribute("inert", "");
	target.removeAttribute("inert");
	target.focus();
	document.body.style.overflow = "hidden";
};

const trapReaction: Reaction = {
	name: "trap",
	attribute: "trap",
	setup: (directive, context) => {
		if (!(directive.element instanceof HTMLElement)) return;
		if (directive.reference?.type === "identifier") {
			context.warn(
				`The "${directive.attributeName}" directive requires state or an action.`,
			);
			return;
		}

		const target = directive.element;
		const inertWhenInactive = directive.specifier.split(".").includes("both");
		createResolvedEffect(directive, context, (value) => {
			if (value) activateTrap(target);
			else releaseTrap(target, inertWhenInactive);
		});

		return () => releaseTrap(target, false);
	},
};

export default trapReaction;
