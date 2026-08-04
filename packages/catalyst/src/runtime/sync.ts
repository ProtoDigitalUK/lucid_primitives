import { initialiseStoreAction } from "../core/store/index.js";
import type { Directive, ReactionPhase, SyncOptions } from "../types/index.js";
import collectDirectives from "./collect-directives.js";
import collectStores from "./collect-stores.js";
import createGlobalEffectDirectives from "./create-global-effect-directives.js";
import disposeStaleDirectives from "./dispose-stale-directives.js";
import Catalyst from "./catalyst.js";
import initialiseDirective from "./initialise-directive.js";

const initialisePhase = (directives: Directive[], phase: ReactionPhase) => {
	for (const directive of directives) {
		const reaction = Catalyst.reactions.get(directive.reaction);
		const reactionPhase = reaction?.phase ?? "afterStoreInit";
		if (reactionPhase === phase) initialiseDirective(directive);
	}
};

const sync = (target: Element, options?: SyncOptions) => {
	if (!Catalyst.started) return;

	disposeStaleDirectives(target, options);
	const stores = collectStores(target, options);
	const directives = collectDirectives(target, options);

	initialisePhase(directives, "beforeStoreInit");
	for (const store of stores) initialiseStoreAction(store);

	directives.push(...createGlobalEffectDirectives(stores));
	initialisePhase(directives, "afterStoreInit");
};

export default sync;
