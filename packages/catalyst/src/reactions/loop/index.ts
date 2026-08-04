import type { Reaction } from "../../types/index.js";
import { LOOP_INDEX, LOOP_INDEX_ONE } from "../../runtime/constants.js";
import createResolvedEffect from "../utils/create-resolved-effect.js";

const getDepthToken = (token: string, depth: number) =>
	depth === 0 ? token : `${token.slice(0, -1)}-${depth}:`;

const replaceIndexes = (value: string, index: number, depth: number) =>
	value
		.replaceAll(getDepthToken(LOOP_INDEX, depth), String(index))
		.replaceAll(getDepthToken(LOOP_INDEX_ONE, depth), String(index + 1));

const replaceNodeIndexes = (
	node: Node,
	index: number,
	loopAttribute: string,
	depth = 0,
) => {
	if (node instanceof Text) {
		node.textContent = replaceIndexes(node.textContent ?? "", index, depth);
		return;
	}
	if (!(node instanceof Element)) return;

	for (const attribute of Array.from(node.attributes)) {
		const value = replaceIndexes(attribute.value, index, depth);
		if (value !== attribute.value) node.setAttribute(attribute.name, value);
	}

	if (node instanceof HTMLTemplateElement) {
		const templateDepth = node.parentElement?.hasAttribute(loopAttribute)
			? depth + 1
			: depth;
		for (const child of Array.from(node.content.childNodes)) {
			replaceNodeIndexes(child, index, loopAttribute, templateDepth);
		}
		return;
	}
	for (const child of Array.from(node.childNodes)) {
		replaceNodeIndexes(child, index, loopAttribute, depth);
	}
};

const getTemplate = (target: Element) =>
	Array.from(target.children).find(
		(element): element is HTMLTemplateElement =>
			element instanceof HTMLTemplateElement,
	);

const loopReaction: Reaction = {
	name: "loop",
	attribute: "loop",
	setup: (directive, context) => {
		if (directive.reference?.type === "identifier") {
			context.warn(
				`The "${directive.attributeName}" directive requires state or an action.`,
			);
			return;
		}

		const template = getTemplate(directive.element);
		if (!template) {
			context.warn(
				`The "${directive.attributeName}" directive requires a direct template child.`,
			);
			return;
		}
		if (template.content.children.length !== 1) {
			context.warn("Loop templates must contain exactly one element child.");
			return;
		}

		createResolvedEffect(directive, context, (value) => {
			if (!Array.isArray(value)) {
				context.warn(
					`The "${directive.attributeName}" directive must resolve to an array.`,
				);
				return;
			}

			context.disposeSubtree(directive.element, { childrenOnly: true });
			for (const child of Array.from(directive.element.childNodes)) {
				if (child !== template) child.remove();
			}

			const result = document.createDocumentFragment();
			for (let index = 0; index < value.length; index += 1) {
				const clone = template.content.cloneNode(true) as DocumentFragment;
				for (const child of Array.from(clone.childNodes)) {
					replaceNodeIndexes(child, index, directive.attributeName);
				}
				result.append(clone);
			}
			directive.element.append(result);
			context.sync(directive.element, { childrenOnly: true });
		});
		return () => {
			context.disposeSubtree(directive.element, { childrenOnly: true });
		};
	},
};

export default loopReaction;
