import type { SetStoreFunction } from "solid-js/store";
import type { Signal } from "solid-js";
import type {
	BindAttributesMap,
	StateBindAttributesMap,
	HandlerAttributesMap,
	StateAttribtuesMap,
} from "./index.js";

// TODO: update naming of these, especially attribute/bindAttributes as naming is confusing
export type AttributeMaps = {
	state: StateAttribtuesMap;
	stateBindAttributes: StateBindAttributesMap;
	// TODO: remove attribute? - not used
	attribute: BindAttributesMap;
	handler: HandlerAttributesMap;
};

export type StoreState = Record<string, unknown>;
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type StoreActions = Record<string, (...args: any[]) => unknown>;

export type StoreData<S extends StoreState, A extends StoreActions> = {
	initialised: boolean;
	dispose: () => void;
	attributeMaps?: AttributeMaps;
	stateObserver?: MutationObserver;
	state: { [K in keyof S]: Signal<S[K]> };
	actions: A;
};

export type Store<S extends StoreState, A extends StoreActions> = [
	get: StoreData<S, A>,
	set: SetStoreFunction<StoreData<S, A>>,
];

export type StoreModule<S extends StoreState, A extends StoreActions> = (
	store: StoreData<S, A>,
) => {
	state?: Partial<{ [K in keyof S]: Signal<S[K]> }>;
	actions: A;
};
