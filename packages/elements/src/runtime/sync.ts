import { initialiseStoreAction } from "../core/store/index.js";
import type {
	HandlerDirective,
	HandlerPhase,
	SyncOptions,
} from "../types/index.js";
import collectDirectives from "./collect-directives.js";
import collectStores from "./collect-stores.js";
import createGlobalEffectDirectives from "./create-global-effect-directives.js";
import disposeStaleDirectives from "./dispose-stale-directives.js";
import Elements from "./elements.js";
import initialiseDirective from "./initialise-directive.js";

const initialisePhase = (
	directives: HandlerDirective[],
	phase: HandlerPhase,
) => {
	for (const directive of directives) {
		const handler = Elements.handlers.get(directive.handler);
		const handlerPhase = handler?.phase ?? "afterStoreInit";
		if (handlerPhase === phase) initialiseDirective(directive);
	}
};

const sync = (target: Element, options?: SyncOptions) => {
	if (!Elements.started) return;

	disposeStaleDirectives(target, options);
	const stores = collectStores(target, options);
	const directives = collectDirectives(target, options);

	initialisePhase(directives, "beforeStoreInit");
	for (const store of stores) initialiseStoreAction(store);

	directives.push(...createGlobalEffectDirectives(stores));
	initialisePhase(directives, "afterStoreInit");
};

export default sync;
