import { evaluatePathValue } from "../helpers.js";
import type { MemberReference } from "../types/index.js";
import Catalyst from "./catalyst.js";
import { warn } from "./log.js";

const resolveReference = (reference: MemberReference, args: unknown[] = []) => {
	const store = Catalyst.stores.get(reference.scope);
	if (!store) {
		warn(`Cannot find a store with the scope "${reference.scope}".`);
		return undefined;
	}

	if (reference.type === "state") {
		const signal = store.state[reference.key];
		if (!signal) {
			warn(
				`Cannot find state "${reference.key}" on store "${reference.scope}".`,
			);
			return undefined;
		}

		const value = signal[0]();
		return reference.path.length
			? evaluatePathValue(value, reference.path)
			: value;
	}

	if (reference.type === "action") {
		const action = store.actions[reference.key];
		if (!action) {
			warn(
				`Cannot find action "${reference.key}" on store "${reference.scope}".`,
			);
			return undefined;
		}
		return action(...args);
	}

	return reference.key;
};

export default resolveReference;
