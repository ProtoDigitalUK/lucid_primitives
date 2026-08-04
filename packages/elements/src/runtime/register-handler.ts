import type { Handler } from "../types/index.js";
import Elements from "./elements.js";
import { warn } from "./log.js";

const registerHandler = (handler: Handler) => {
	if (Elements.started) {
		warn("Handlers must be registered before Elements.start() is called.");
		return;
	}
	if (Elements.handlers.has(handler.name)) {
		warn(`A handler named "${handler.name}" is already registered.`);
		return;
	}
	if (
		Array.from(Elements.handlers.values()).some(
			(existing) => existing.attribute === handler.attribute,
		)
	) {
		warn(`A handler already uses the "data-${handler.attribute}" attribute.`);
		return;
	}

	Elements.handlers.set(handler.name, handler);
};

export default registerHandler;
