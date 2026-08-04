import type { Directive, Store } from "../types/index.js";
import Catalyst from "./catalyst.js";

const createGlobalEffectDirectives = (stores: Store[]) => {
	if (!Catalyst.reactions.has("effects")) return [];

	const directives: Directive[] = [];
	for (const store of stores) {
		for (const key of Object.keys(store.effects.global)) {
			const value = `${store.key}${Catalyst.options.attributes.scopeSeparator}#${key}`;
			directives.push({
				element: store.element,
				reaction: "effects",
				attributeName: `@catalyst-effects-global:${key}`,
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
