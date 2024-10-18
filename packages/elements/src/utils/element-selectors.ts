import C from "../core/constants.js";
import helpers from "./helpers.js";

/**
 * Gets all elements with the elements attribute - stores are scoped to these elements
 */
const getAllElements = (): Array<[HTMLElement, string | null]> => {
	const elements: NodeListOf<HTMLElement> = document.querySelectorAll(
		`[${helpers.buildAttribute(C.attributes.entry)}]`,
	);

	return Array.from(elements).map((element) => [
		element,
		element.getAttribute(helpers.buildAttribute(C.attributes.entry)),
	]);
};

/**
 * The Element attribute selectors
 */
const elementSelectors = {
	getAllElements,
};

export default elementSelectors;
