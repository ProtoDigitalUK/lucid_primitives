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

type StoreActions = Record<string, (...args: unknown[]) => unknown>;

export type StoreData<T extends Record<string, unknown>> = {
	initialised: boolean;
	dispose: () => void;
	attributeMaps?: AttributeMaps;
	stateObserver?: MutationObserver;
	state: { [K in keyof T]: Signal<T[K]> };
	actions: StoreActions;
};

export type Store<T extends Record<string, unknown>> = [
	get: StoreData<T>,
	set: SetStoreFunction<StoreData<T>>,
];

export type StoreModule<T extends Record<string, unknown>> = (
	store: StoreData<T>,
) => {
	state?: Partial<{ [K in keyof T]: Signal<T[K]> }>;
	actions: StoreActions;
};
