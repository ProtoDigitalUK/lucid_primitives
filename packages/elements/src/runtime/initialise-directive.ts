import { createRoot, onCleanup } from "solid-js";
import type { HandlerContext, HandlerDirective } from "../types/index.js";
import disposeSubtree from "./dispose-subtree.js";
import Elements from "./elements.js";
import { debug, warn } from "./log.js";
import resolveReference from "./resolve-reference.js";
import sync from "./sync.js";
import type { DirectiveRegistration } from "./types.js";
import disposeRegistration from "./dispose-registration.js";

const context: HandlerContext = {
	getStore: (scope) => Elements.stores.get(scope),
	resolve: resolveReference,
	sync: (target, options) => sync(target, options),
	disposeSubtree,
	warn,
	debug,
};

const directiveMatches = (left: HandlerDirective, right: HandlerDirective) =>
	left.handler === right.handler &&
	left.specifier === right.specifier &&
	left.value === right.value;

const initialiseDirective = (directive: HandlerDirective) => {
	const handler = Elements.handlers.get(directive.handler);
	if (!handler) return;

	let elementRegistrations = Elements.registrations.get(directive.element);
	if (!elementRegistrations) {
		elementRegistrations = new Map();
		Elements.registrations.set(directive.element, elementRegistrations);
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
			const cleanup = handler.setup(directive, context);
			if (cleanup) onCleanup(cleanup);
		} catch (error) {
			console.error(error);
		}
		return disposeRoot;
	});
};

export default initialiseDirective;
