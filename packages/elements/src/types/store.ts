import type { SetStoreFunction } from "solid-js/store";
import type { Signal } from "solid-js";
import type {
	BindAttributesMap,
	HandlerAttributesMap,
	StateAttribtuesMap,
} from "./index.js";

export type AttributeMaps = {
	state: StateAttribtuesMap;
	attribute: BindAttributesMap;
	handler: HandlerAttributesMap;
};

export type ElementsStoreData<T extends Record<string, unknown>> = {
	initialised: boolean;
	dispose: () => void;
	attributeMaps?: AttributeMaps;
	state: { [K in keyof T]: Signal<T[K]> };
};

export type ElementsStore<T extends Record<string, unknown>> = [
	get: ElementsStoreData<T>,
	set: SetStoreFunction<ElementsStoreData<T>>,
];
