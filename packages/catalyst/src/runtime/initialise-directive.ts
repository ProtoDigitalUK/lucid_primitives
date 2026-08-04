import { createRoot, onCleanup } from "solid-js";
import type { ReactionContext, Directive } from "../types/index.js";
import disposeSubtree from "./dispose-subtree.js";
import Catalyst from "./catalyst.js";
import { debug, warn } from "./log.js";
import resolveReference from "./resolve-reference.js";
import sync from "./sync.js";
import type { DirectiveRegistration } from "./types.js";
import disposeRegistration from "./dispose-registration.js";

const context: ReactionContext = {
	getStore: (scope) => Catalyst.stores.get(scope),
	resolve: resolveReference,
	sync: (target, options) => sync(target, options),
	disposeSubtree,
	warn,
	debug,
};

const referencesMatch = (
	left: Directive["reference"],
	right: Directive["reference"],
) => {
	if (!left || !right) return left === right;
	if (
		left.raw !== right.raw ||
		left.type !== right.type ||
		left.scope !== right.scope ||
		left.key !== right.key ||
		left.path.join(".") !== right.path.join(".")
	) {
		return false;
	}
	if (left.type === "loop" && right.type === "loop") {
		return Object.is(left.value, right.value);
	}
	return true;
};

const directiveMatches = (left: Directive, right: Directive) =>
	left.reaction === right.reaction &&
	left.specifier === right.specifier &&
	left.value === right.value &&
	referencesMatch(left.reference, right.reference);

const initialiseDirective = (directive: Directive) => {
	const reaction = Catalyst.reactions.get(directive.reaction);
	if (!reaction) return;

	let elementRegistrations = Catalyst.registrations.get(directive.element);
	if (!elementRegistrations) {
		elementRegistrations = new Map();
		Catalyst.registrations.set(directive.element, elementRegistrations);
	}

	const existing = elementRegistrations.get(directive.attributeName);
	if (existing && directiveMatches(existing.directive, directive)) return;
	if (existing) disposeRegistration(existing);

	const registration: DirectiveRegistration = {
		directive,
		dispose: () => {},
	};
	elementRegistrations.set(directive.attributeName, registration);

	registration.dispose = createRoot((disposeRoot) => {
		try {
			const cleanup = reaction.setup(directive, context);
			if (cleanup) onCleanup(cleanup);
		} catch (error) {
			console.error(error);
		}
		return disposeRoot;
	});
};

export default initialiseDirective;
