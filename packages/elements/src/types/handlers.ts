import type { HandlerDirective, MemberReference } from "./directives.js";
import type { Store } from "./store.js";

export type HandlerPhase = "afterStoreInit" | "beforeStoreInit";

export type SyncOptions = {
	childrenOnly?: boolean;
};

export type HandlerContext = {
	getStore: (scope: string) => Store | undefined;
	resolve: (reference: MemberReference, args?: unknown[]) => unknown;
	sync: (target: Element, options?: SyncOptions) => void;
	disposeSubtree: (target: Element, options?: SyncOptions) => void;
	warn: (message: string) => void;
	debug: (message: string) => void;
};

export type Handler = {
	name: string;
	attribute: string;
	phase?: HandlerPhase;
	setup: (
		directive: HandlerDirective,
		context: HandlerContext,
	) => undefined | (() => void);
};
