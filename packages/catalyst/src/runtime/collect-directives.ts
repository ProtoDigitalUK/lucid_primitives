import { parseReference } from "../helpers.js";
import type { Directive, SyncOptions } from "../types/index.js";
import collectElements from "./collect-elements.js";
import Catalyst from "./catalyst.js";

const collectDirectives = (target: Element, options?: SyncOptions) => {
	const directives: Directive[] = [];
	const separator = Catalyst.options.attributes.specifierSeparator;
	const prefix = Catalyst.options.attributes.prefix;

	for (const element of collectElements(target, options)) {
		for (const attribute of element.attributes) {
			for (const reaction of Catalyst.reactions.values()) {
				const baseAttribute = `${prefix}${reaction.attribute}`;
				const specifierPrefix = `${baseAttribute}${separator}`;
				if (
					attribute.name !== baseAttribute &&
					!attribute.name.startsWith(specifierPrefix)
				) {
					continue;
				}

				directives.push({
					element,
					reaction: reaction.name,
					attributeName: attribute.name,
					specifier:
						attribute.name === baseAttribute
							? ""
							: attribute.name.slice(specifierPrefix.length),
					value: attribute.value,
					reference: parseReference(
						attribute.value,
						Catalyst.options.attributes.scopeSeparator,
					),
					synthetic: false,
				});
				break;
			}
		}
	}

	return directives;
};

export default collectDirectives;
