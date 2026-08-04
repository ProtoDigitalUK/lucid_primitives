import type { HandlerDirective, Store } from "../types/index.js";
import Elements from "./elements.js";

const createGlobalEffectDirectives = (stores: Store[]) => {
	if (!Elements.handlers.has("effects")) return [];

	const directives: HandlerDirective[] = [];
	for (const store of stores) {
		for (const key of Object.keys(store.effects.global)) {
			const value = `${store.key}${Elements.options.attributes.scopeSeparator}${key}`;
			directives.push({
				element: store.element,
				handler: "effects",
				attributeName: `@elements-effects-global:${key}`,
				specifier: "global",
				value,
				reference: {
					raw: value,
					scope: store.key,
					type: "identifier",
					key,
					path: [],
				},
				synthetic: true,
			});
		}
	}
	return directives;
};

export default createGlobalEffectDirectives;
