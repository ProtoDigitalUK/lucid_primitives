import { createEffect, createRoot } from "solid-js";
import type { Reaction, Store } from "../../types/index.js";

type EffectRegistration = {
	count: number;
	dispose: () => void;
};

const effectRegistrations = new WeakMap<
	Store,
	Map<string, EffectRegistration>
>();

const effectsReaction: Reaction = {
	name: "effects",
	attribute: "effects",
	setup: (directive, context) => {
		const reference = directive.reference;
		if (!reference || reference.type !== "identifier") {
			context.warn(
				`The "${directive.attributeName}" directive requires a #effect name.`,
			);
			return;
		}
		if (!reference.scope) {
			context.warn(
				`Cannot infer a store for the reference "${reference.raw}".`,
			);
			return;
		}

		const store = context.getStore(reference.scope);
		if (!store) {
			context.warn(`Cannot find a store with the scope "${reference.scope}".`);
			return;
		}

		const type = directive.specifier === "global" ? "global" : "manual";
		const effect = store.effects[type][reference.key];
		if (!effect) {
			context.warn(
				`Cannot find ${type} effect "${reference.key}" on store "${reference.scope}".`,
			);
			return;
		}

		let storeRegistrations = effectRegistrations.get(store);
		if (!storeRegistrations) {
			storeRegistrations = new Map();
			effectRegistrations.set(store, storeRegistrations);
		}

		const registrationKey = `${type}:${reference.key}`;
		const existing = storeRegistrations.get(registrationKey);
		if (existing) {
			existing.count += 1;
			return () => {
				existing.count -= 1;
				if (existing.count === 0) {
					existing.dispose();
					storeRegistrations?.delete(registrationKey);
				}
			};
		}

		const dispose = createRoot((disposeRoot) => {
			let hasRun = false;
			createEffect(() => {
				try {
					effect({ isInitial: !hasRun });
					hasRun = true;
				} catch (error) {
					console.error(error);
				}
			});
			return disposeRoot;
		});

		storeRegistrations.set(registrationKey, { count: 1, dispose });
		return () => {
			const registration = storeRegistrations?.get(registrationKey);
			if (!registration) return;
			registration.count -= 1;
			if (registration.count === 0) {
				registration.dispose();
				storeRegistrations?.delete(registrationKey);
			}
		};
	},
};

export default effectsReaction;
