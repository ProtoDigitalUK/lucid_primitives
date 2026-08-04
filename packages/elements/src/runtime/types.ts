import type {
	ElementsStartOptions,
	Handler,
	HandlerDirective,
	Store,
	StoreActions,
	StoreModule,
	StoreState,
} from "../types/index.js";

export type ResolvedElementsOptions = {
	debug: boolean;
	attributes: {
		prefix: string;
		store: string;
		state: string;
		scopeSeparator: string;
		specifierSeparator: string;
	};
};

export type DirectiveRegistration = {
	directive: HandlerDirective;
	dispose: () => void;
};

export type ElementsRuntime = {
	options: ResolvedElementsOptions;
	startOptions?: ElementsStartOptions;
	started: boolean;
	handlers: Map<string, Handler>;
	stores: Map<string, Store>;
	storeModules: Map<string, StoreModule<StoreState, StoreActions>>;
	registrations: Map<Element, Map<string, DirectiveRegistration>>;
	removalObserver?: MutationObserver;
};
