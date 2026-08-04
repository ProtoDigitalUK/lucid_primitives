import type { Handler, MemberReference } from "../../types/index.js";

type EventRegistration = {
	count: number;
	abortController: AbortController;
};

const eventRegistrations = new WeakMap<
	EventTarget,
	Map<string, EventRegistration>
>();

const getEventTarget = (
	element: Element,
	specifier: string,
): { target: EventTarget; eventName: string } | null => {
	const parts = specifier.split(".");
	const possibleTargets = ["document", "body", "head", "window"];
	if (parts[0] && possibleTargets.includes(parts[0])) {
		const eventName = parts[1];
		if (!eventName) return null;
		switch (parts[0]) {
			case "document":
				return { target: document, eventName };
			case "body":
				return { target: document.body, eventName };
			case "head":
				return { target: document.head, eventName };
			case "window":
				return { target: window, eventName };
		}
	}

	return parts[0] ? { target: element, eventName: parts[0] } : null;
};

const callAction = (
	reference: MemberReference,
	event: Event,
	resolve: (reference: MemberReference, args?: unknown[]) => unknown,
) => {
	try {
		const result = resolve(reference, [event]);
		void Promise.resolve(result).catch(console.error);
	} catch (error) {
		console.error(error);
	}
};

const eventsHandler: Handler = {
	name: "events",
	attribute: "events",
	setup: (directive, context) => {
		const reference = directive.reference;
		if (!reference || reference.type !== "action") {
			context.warn(
				`The "${directive.attributeName}" directive requires an action.`,
			);
			return;
		}

		const config = getEventTarget(directive.element, directive.specifier);
		if (!config) {
			context.warn(
				`The "${directive.attributeName}" directive requires an event specifier.`,
			);
			return;
		}

		let targetRegistrations = eventRegistrations.get(config.target);
		if (!targetRegistrations) {
			targetRegistrations = new Map();
			eventRegistrations.set(config.target, targetRegistrations);
		}

		const registrationKey = `${config.eventName}:${reference.raw}`;
		const existing = targetRegistrations.get(registrationKey);
		if (existing) {
			existing.count += 1;
			return () => {
				existing.count -= 1;
				if (existing.count === 0) {
					existing.abortController.abort();
					targetRegistrations?.delete(registrationKey);
				}
			};
		}

		const abortController = new AbortController();
		config.target.addEventListener(
			config.eventName,
			(event) => callAction(reference, event, context.resolve),
			{ signal: abortController.signal },
		);
		targetRegistrations.set(registrationKey, {
			count: 1,
			abortController,
		});

		return () => {
			const registration = targetRegistrations?.get(registrationKey);
			if (!registration) return;
			registration.count -= 1;
			if (registration.count === 0) {
				registration.abortController.abort();
				targetRegistrations?.delete(registrationKey);
			}
		};
	},
};

export default eventsHandler;
