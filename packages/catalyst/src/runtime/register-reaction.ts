import type { Reaction } from "../types/index.js";
import Catalyst from "./catalyst.js";
import { warn } from "./log.js";

const registerReaction = (reaction: Reaction) => {
	if (Catalyst.started) {
		warn("Reactions must be registered before Catalyst.start() is called.");
		return;
	}
	if (Catalyst.reactions.has(reaction.name)) {
		warn(`A reaction named "${reaction.name}" is already registered.`);
		return;
	}
	if (
		Array.from(Catalyst.reactions.values()).some(
			(existing) => existing.attribute === reaction.attribute,
		)
	) {
		warn(`A reaction already uses the "data-${reaction.attribute}" attribute.`);
		return;
	}

	Catalyst.reactions.set(reaction.name, reaction);
};

export default registerReaction;
