import type { DirectiveRegistration } from "./types.js";
import Elements from "./elements.js";

const disposeRegistration = (registration: DirectiveRegistration) => {
	const elementRegistrations = Elements.registrations.get(
		registration.directive.element,
	);
	if (
		elementRegistrations?.get(registration.directive.attributeName) ===
		registration
	) {
		elementRegistrations.delete(registration.directive.attributeName);
		if (elementRegistrations.size === 0) {
			Elements.registrations.delete(registration.directive.element);
		}
	}

	registration.dispose();
};

export default disposeRegistration;
