import type { Reaction } from "../../types/index.js";

const refsReaction: Reaction = {
	name: "refs",
	attribute: "ref",
	phase: "beforeStoreInit",
	setup: (directive, context) => {
		const reference = directive.reference;
		if (!reference || reference.type !== "identifier") {
			context.warn(
				`The "${directive.attributeName}" directive requires a scoped ref name.`,
			);
			return;
		}

		const store = context.getStore(reference.scope);
		if (!store) {
			context.warn(`Cannot find a store with the scope "${reference.scope}".`);
			return;
		}

		const isArray = reference.key.endsWith("[]");
		const key = isArray ? reference.key.slice(0, -2) : reference.key;
		if (!key) return;

		if (isArray) {
			const existing = store.refs.get(key);
			const refs = Array.isArray(existing) ? existing : [];
			if (!refs.includes(directive.element)) refs.push(directive.element);
			store.refs.set(key, refs);

			return () => {
				const current = store.refs.get(key);
				if (!Array.isArray(current)) return;
				const index = current.indexOf(directive.element);
				if (index >= 0) current.splice(index, 1);
				if (current.length === 0) store.refs.delete(key);
			};
		}

		const existing = store.refs.get(key);
		if (existing && existing !== directive.element) {
			context.warn(
				`The ref "${key}" is already registered on store "${reference.scope}".`,
			);
			return;
		}

		store.refs.set(key, directive.element);
		return () => {
			if (store.refs.get(key) === directive.element) store.refs.delete(key);
		};
	},
};

export default refsReaction;
