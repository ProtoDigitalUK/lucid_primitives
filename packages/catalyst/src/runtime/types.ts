import type {
	CatalystStartOptions,
	Reaction,
	Directive,
	Store,
	StoreActions,
	StoreModule,
	StoreState,
} from "../types/index.js";

export type ResolvedCatalystOptions = {
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
	directive: Directive;
	dispose: () => void;
};

export type CatalystRuntime = {
	options: ResolvedCatalystOptions;
	startOptions?: CatalystStartOptions;
	started: boolean;
	reactions: Map<string, Reaction>;
	stores: Map<string, Store>;
	storeModules: Map<string, StoreModule<StoreState, StoreActions>>;
	registrations: Map<Element, Map<string, DirectiveRegistration>>;
	removalObserver?: MutationObserver;
};
