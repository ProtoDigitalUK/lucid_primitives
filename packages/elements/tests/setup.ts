import { afterEach } from "vitest";
import Elements from "../src/index.js";
import Runtime from "../src/runtime/elements.js";

afterEach(() => {
	Elements.destroy();
	Runtime.handlers.clear();
	Runtime.storeModules.clear();
	document.body.innerHTML = "";
});
