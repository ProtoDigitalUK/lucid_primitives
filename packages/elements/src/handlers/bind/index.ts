import { stringifyState } from "../../helpers.js";
import type { Handler } from "../../types/index.js";
import createResolvedEffect from "../utils/create-resolved-effect.js";

const bindHandler: Handler = {
	name: "bind",
	attribute: "bind",
	setup: (directive, context) => {
		if (!directive.specifier) {
			context.warn("Bind directives require a target attribute specifier.");
			return;
		}
		if (directive.reference?.type === "identifier") {
			context.warn(
				`The "${directive.attributeName}" directive requires state or an action.`,
			);
			return;
		}

		createResolvedEffect(directive, context, (value) => {
			directive.element.setAttribute(
				directive.specifier,
				stringifyState(value),
			);
		});
		return undefined;
	},
};

export default bindHandler;
