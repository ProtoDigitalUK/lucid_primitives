import { parseReference } from "../helpers.js";
import type { HandlerDirective, SyncOptions } from "../types/index.js";
import collectElements from "./collect-elements.js";
import Elements from "./elements.js";

const collectDirectives = (target: Element, options?: SyncOptions) => {
	const directives: HandlerDirective[] = [];
	const separator = Elements.options.attributes.specifierSeparator;
	const prefix = Elements.options.attributes.prefix;

	for (const element of collectElements(target, options)) {
		for (const attribute of element.attributes) {
			for (const handler of Elements.handlers.values()) {
				const baseAttribute = `${prefix}${handler.attribute}`;
				const specifierPrefix = `${baseAttribute}${separator}`;
				if (
					attribute.name !== baseAttribute &&
					!attribute.name.startsWith(specifierPrefix)
				) {
					continue;
				}

				directives.push({
					element,
					handler: handler.name,
					attributeName: attribute.name,
					specifier:
						attribute.name === baseAttribute
							? ""
							: attribute.name.slice(specifierPrefix.length),
					value: attribute.value,
					reference: parseReference(
						attribute.value,
						Elements.options.attributes.scopeSeparator,
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
