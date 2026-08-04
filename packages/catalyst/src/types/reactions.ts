import type { Directive, MemberReference } from "./directives.js";
import type { Store } from "./store.js";

export type ReactionPhase = "afterStoreInit" | "beforeStoreInit";

export type SyncOptions = {
	childrenOnly?: boolean;
};

export type ReactionContext = {
	getStore: (scope: string) => Store | undefined;
	resolve: (reference: MemberReference, args?: unknown[]) => unknown;
	sync: (target: Element, options?: SyncOptions) => void;
	disposeSubtree: (target: Element, options?: SyncOptions) => void;
	warn: (message: string) => void;
	debug: (message: string) => void;
};

export type Reaction = {
	name: string;
	attribute: string;
	phase?: ReactionPhase;
	setup: (
		directive: Directive,
		context: ReactionContext,
	) => undefined | (() => void);
};
