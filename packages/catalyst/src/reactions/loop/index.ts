import type { Reaction } from "../../types/index.js";
import { getLoopContext, setLoopContext } from "../../runtime/loop-context.js";
import createResolvedEffect from "../utils/create-resolved-effect.js";

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
			const parent = getLoopContext(directive.element);
			for (let index = 0; index < value.length; index += 1) {
				const clone = template.content.cloneNode(true) as DocumentFragment;
				const root = clone.firstElementChild;
				if (!root) continue;
				setLoopContext(root, {
					item: value[index],
					index,
					indexOne: index + 1,
					parent,
				});
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
