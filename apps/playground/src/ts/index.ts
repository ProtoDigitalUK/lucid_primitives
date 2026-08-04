import Elements, { storeModule } from "@lucidclient/elements";
import { standardHandlers } from "@lucidclient/elements/handlers";
import { speculateLinks } from "@lucidclient/speculate";
import "./speculate/speculator";

import loopsStore from "./elements/loops";
import exampleStore from "./elements/example";
import navStore from "./elements/nav";
import bindsStore from "./elements/binds";

storeModule("loops", loopsStore);
storeModule("example", exampleStore);
storeModule("nav", navStore);
storeModule("binds", bindsStore);

Elements.start({
	debug: true,
	handlers: standardHandlers,
});

speculateLinks();
