import { afterEach } from "vitest";
import Catalyst from "../src/index.js";
import Runtime from "../src/runtime/catalyst.js";

afterEach(() => {
	Catalyst.destroy();
	Runtime.reactions.clear();
	Runtime.storeModules.clear();
	document.body.innerHTML = "";
});
