import type { SetStoreFunction } from "solid-js/store";
import type {
	BindAttributesMap,
	HandlerAttributesMap,
	StateAttribtuesMap,
} from "./index.js";

export type ElementsStoreData = {
	initialised: boolean;
	attributeMaps?: {
		state: StateAttribtuesMap;
		attribute: BindAttributesMap;
		handler: HandlerAttributesMap;
	};
	dispose: () => void;
};
export type ElementsStore = [
	get: ElementsStoreData,
	set: SetStoreFunction<ElementsStoreData>,
];
