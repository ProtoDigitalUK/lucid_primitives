import destroy from "./runtime/destroy.js";
import refresh from "./runtime/refresh.js";
import start from "./runtime/start.js";
import sync from "./runtime/sync.js";

export { default as registerReaction } from "./runtime/register-reaction.js";
export { default as storeModule } from "./core/store-module.js";
export { createEffect, createMemo, createSignal } from "solid-js";

export default {
	start,
	destroy,
	refresh,
	sync,
};
