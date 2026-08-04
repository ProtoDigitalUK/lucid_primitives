import type {
	LoopMemberReference,
	LoopMemberReferenceKey,
	MemberReference,
	StoreMemberReference,
} from "../types/index.js";
import Catalyst from "./catalyst.js";
import { getLoopContext, type LoopContext } from "./loop-context.js";

const LOOP_REFERENCE_KEYS: LoopMemberReferenceKey[] = [
	"item",
	"index",
	"indexOne",
];

const getNearestStoreScope = (element: Element) => {
	const attributeName = `${Catalyst.options.attributes.prefix}${Catalyst.options.attributes.store}`;
	let current: Element | null = element;
	while (current) {
		if (current.hasAttribute(attributeName)) {
			return current.getAttribute(attributeName) || null;
		}
		current = current.parentElement;
	}
	return null;
};

const resolveLoopReference = (
	reference: StoreMemberReference,
	context: LoopContext,
): LoopMemberReference | null => {
	if (reference.type !== "state") return null;

	const parts = [reference.key, ...reference.path];
	let targetContext: LoopContext | undefined = context;
	while (parts[0] === "parent") {
		targetContext = targetContext?.parent;
		parts.shift();
	}

	const key = parts.shift();
	if (!key || !LOOP_REFERENCE_KEYS.includes(key as LoopMemberReferenceKey)) {
		return null;
	}

	return {
		raw: reference.raw,
		scope: null,
		type: "loop",
		key: key as LoopMemberReferenceKey,
		path: parts,
		value: targetContext?.[key as LoopMemberReferenceKey],
	};
};

const resolveDirectiveReference = (
	reference: MemberReference | null,
	element: Element,
): MemberReference | null => {
	if (!reference || reference.type === "loop" || reference.scope) {
		return reference;
	}

	const loopContext = getLoopContext(element);
	if (loopContext) {
		const loopReference = resolveLoopReference(reference, loopContext);
		if (loopReference) return loopReference;
	}

	const scope = getNearestStoreScope(element);
	return scope ? { ...reference, scope } : reference;
};

export default resolveDirectiveReference;
