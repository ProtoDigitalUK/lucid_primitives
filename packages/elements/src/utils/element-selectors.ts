import C from "../core/constants.js";
import utils from "./index.js";

/**
 * Gets all elements with the elements attribute - stores are scoped to these elements
 */
const getAllElements = (): Array<[HTMLElement, string | null]> => {
	const elements: NodeListOf<HTMLElement> = document.querySelectorAll(
		`[${utils.helpers.buildAttribute(C.attributes.entry)}]`,
	);

	return Array.from(elements).map((element) => [
		element,
		element.getAttribute(utils.helpers.buildAttribute(C.attributes.entry)),
	]);
};

/**
 * Returns a list of all elements with the given state attribute
 */
const getStateElements = (
	element: HTMLElement,
	key: string,
): {
	attribute: string;
	elements: NodeListOf<HTMLElement>;
} => {
	const statePrefix = utils.helpers.buildAttribute(C.attributes.statePrefix); //* 'data-state--'
	const attribute = statePrefix + key;

	return {
		attribute: attribute,
		elements: element.querySelectorAll(`[${attribute}]`),
	};
};

/**
 * The Element attribute selectors
 */
const elementSelectors = {
	getAllElements,
	getStateElements,
};

export default elementSelectors;
