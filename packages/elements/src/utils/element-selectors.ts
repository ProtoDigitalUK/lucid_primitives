import Elements from "../core/elements.js";
import utils from "./index.js";

/**
 * Gets all elements with the elements attribute - stores are scoped to these elements
 */
const getAllElements = (): Array<[HTMLElement, string | null]> => {
	const elements: NodeListOf<HTMLElement> = document.querySelectorAll(
		`[${utils.helpers.buildAttribute(Elements.options.attributes.selectors.element)}]`,
	);

	return Array.from(elements).map((element) => [
		element,
		element.getAttribute(
			utils.helpers.buildAttribute(
				Elements.options.attributes.selectors.element,
			),
		),
	]);
};

/**
 * The Element attribute selectors
 */
const elementSelectors = {
	getAllElements,
};

export default elementSelectors;
