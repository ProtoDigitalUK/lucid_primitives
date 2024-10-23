import type {
	Store,
	StoreState,
	StoreActions,
	Refs,
} from "../../types/index.js";
import C from "../constants.js";
import utils from "../../utils/index.js";

/**
 * Selects all of the data-ref elements and creates Map of key to element / elements
 * - If the data-ref attribute is suffixed with [], it will create an array of elements
 * - Otherwise it will create a single element
 */
const createRefs = (
	element: HTMLElement,
	store: Store<StoreState, StoreActions>,
) => {
	const refPrefix = utils.helpers.buildAttribute(C.attributes.refPrefix);

	const refElements = element.querySelectorAll(`[${refPrefix}]`);

	const refs: Refs = new Map();

	for (const ref of refElements) {
		const refName = ref.getAttribute(refPrefix);
		if (!refName) continue;

		if (refName.endsWith("[]")) {
			const refNameWithoutSuffix = refName.slice(0, -2);
			if (!refs.has(refNameWithoutSuffix)) {
				refs.set(refNameWithoutSuffix, []);
			}
			(refs.get(refNameWithoutSuffix) as Element[]).push(ref);
		} else {
			if (!refs.has(refName)) {
				refs.set(refName, ref);
			}
		}
	}

	store[1]("refs", refs);
};

export default createRefs;
