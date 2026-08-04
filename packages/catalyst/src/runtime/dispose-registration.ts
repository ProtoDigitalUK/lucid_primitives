import type { DirectiveRegistration } from "./types.js";
import Catalyst from "./catalyst.js";

const disposeRegistration = (registration: DirectiveRegistration) => {
	const elementRegistrations = Catalyst.registrations.get(
		registration.directive.element,
	);
	if (
		elementRegistrations?.get(registration.directive.attributeName) ===
		registration
	) {
		elementRegistrations.delete(registration.directive.attributeName);
		if (elementRegistrations.size === 0) {
			Catalyst.registrations.delete(registration.directive.element);
		}
	}

	registration.dispose();
};

export default disposeRegistration;
