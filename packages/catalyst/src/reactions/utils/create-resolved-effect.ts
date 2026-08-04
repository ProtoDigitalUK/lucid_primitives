import { createEffect, onCleanup } from "solid-js";
import type { ReactionContext, Directive } from "../../types/index.js";

const isPromiseLike = (value: unknown): value is PromiseLike<unknown> =>
	typeof value === "object" &&
	value !== null &&
	"then" in value &&
	typeof value.then === "function";

const createResolvedEffect = (
	directive: Directive,
	context: ReactionContext,
	onValue: (value: unknown) => void,
) => {
	if (!directive.reference) {
		context.warn(
			`The "${directive.attributeName}" directive requires a scoped value.`,
		);
		return;
	}

	createEffect(() => {
		let active = true;
		onCleanup(() => {
			active = false;
		});

		try {
			const result = context.resolve(
				directive.reference as NonNullable<typeof directive.reference>,
			);
			if (isPromiseLike(result)) {
				void Promise.resolve(result)
					.then((value) => {
						if (active) onValue(value);
					})
					.catch(console.error);
				return;
			}

			if (active) onValue(result);
		} catch (error) {
			console.error(error);
		}
	});
};

export default createResolvedEffect;
