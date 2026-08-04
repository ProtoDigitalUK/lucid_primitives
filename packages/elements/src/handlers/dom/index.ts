import { stringifyState } from "../../helpers.js";
import type { Handler } from "../../types/index.js";
import createResolvedEffect from "../utils/create-resolved-effect.js";

const updateDom = (element: Element, specifier: string, value: unknown) => {
	if (!(element instanceof HTMLElement)) return;

	switch (specifier) {
		case "html":
			element.innerHTML = stringifyState(value);
			return;
		case "value":
			if (
				element instanceof HTMLInputElement ||
				element instanceof HTMLTextAreaElement ||
				element instanceof HTMLSelectElement
			) {
				element.value = stringifyState(value);
			}
			return;
		case "focus":
			if (value === true) {
				setTimeout(() => {
					if (element.isConnected) element.focus();
				}, 0);
			}
			return;
		case "blur":
			if (value === true) element.blur();
			return;
		case "scrollto":
			if (value === true) element.scrollIntoView({ behavior: "smooth" });
			return;
		default:
			element.innerText = stringifyState(value);
	}
};

const domHandler: Handler = {
	name: "dom",
	attribute: "dom",
	setup: (directive, context) => {
		if (directive.reference?.type === "identifier") {
			context.warn(
				`The "${directive.attributeName}" directive requires state or an action.`,
			);
			return;
		}

		createResolvedEffect(directive, context, (value) => {
			updateDom(directive.element, directive.specifier || "text", value);
		});
		return undefined;
	},
};

export default domHandler;
