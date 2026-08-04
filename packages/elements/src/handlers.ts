import bind from "./handlers/bind/index.js";
import dom from "./handlers/dom/index.js";
import effects from "./handlers/effects/index.js";
import events from "./handlers/events/index.js";
import loop from "./handlers/loop/index.js";
import refs from "./handlers/refs/index.js";
import trap from "./handlers/trap/index.js";

export { bind, dom, effects, events, loop, refs, trap };
export const standardHandlers = [refs, bind, effects, loop, events, dom, trap];
