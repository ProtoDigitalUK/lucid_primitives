import type { SetStoreFunction } from "solid-js/store";
import type {
	StateAttribtuesMap,
	BindAttributesMap,
	HandlerAttributesMap,
} from "./index.js";

export type ElementsStoreData = {
	initialised: boolean;
	attributeMaps?: {
		state: StateAttribtuesMap;
		attribute: BindAttributesMap;
		handler: HandlerAttributesMap;
	};
};
export type ElementsStore = [
	get: ElementsStoreData,
	set: SetStoreFunction<ElementsStoreData>,
];
