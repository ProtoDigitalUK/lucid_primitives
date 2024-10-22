# Lucid Elements

> This is currently an R&D library, and is not recommended for production use as it may not go anywhere. Syntax, APIs and functionality is subject to change.

The missing layer between your HTML and your JS. Elements is a light weight library that levels up your HTML with reactive state attributes, attribute bindings and handlers for event handling, intersection and DOM manipulation.

## Getting Started

```typescript
import Elements, { storeModule, registerHandler, createSignal } from "@lucidclient/elements";
import { EventHandlers, IntersectionHandlers, DOMHandlers } from "@lucidclient/elements/plugins";

registerHandler(EventHandlers);
registerHandler(IntersectionHandlers);
registerHandler(DOMHandlers);

storeModule<
	{
		isdisabled: string;
		customState: string;
	},
	{
		init: () => void;
		handleClick: () => void;
	}
>("exampleStore", (store) => ({
	state: {
		customState: createSignal("hello world"),
	},
	actions: {
		init() {
			store.actions.handleClick(); // or this.handleClick()
		},
		handleClick: () => {
			const [_, setDisabled] = store.state.isdisabled;
			// const [getCustomState, setCustomState] = store.state.customState;

			setDisabled("true");
		},
	},
}));

Elements.start({
  debug: true, // optional
  attributePrefix: "data-" // optional
});
```

## Syntax Breakdown

```html
<div
  data-element="elementStore"

  data-state--disabled="false"
  data-state--expanded="false"
  data-state--object='{ "hello": "world" }'
  data-state--array='["hello", "world"]'

  data-handler--on.click="handleClick"
  data-handler--on.mouseover="handleMouseover"
  data-handler--on.mouseout="handleMouseout"

  data-handler--intersect.enter="enteredViewport"
  data-handler--intersect.leave="leftViewport"
  data-handler--intersect.center="centeredViewport"

  data-bind--disabled="disabled"
  data-bind--aria-expanded="expanded"
  data-bind--data-object-hello="object.hello"
  data-bind--data-array-hello="array[0]"

  class="data-[state-disabled=true]:bg-red-500"
>
  <div
  	data-ref="content"
    data-bind--data-expanded
    class="data-[expanded=true]:h-full"
  >
  	<p data-ref="paragraph[]">Hello World 1</p>
    <p data-ref="paragraph[]">Hello World 2</p>
  </div>
  <button
   	data-ref="button"
    data-handler--on.click="handleClick"
    data-handler--dom.innerText="$expanded ? 'Hide Content' : 'Show Content'"
  >
    Show Content
  </button>
</div>
```
To indicate to the Elements library that an element should have a store created, use the `data-element` attribute.

You can leave the value blank, or pass in a string to link it to a specific store that you have created with the `Elements.store` method.

### State Bindings `data-state--`

All state bindings on the element and its children are added to the store and use signals to keep the state in sync. These are defined using the `data-state--{statekey}="{value}"` attribute, where the `statekey` is the name of the signal and the value is the default value.

These are reactive, meaning on change they will:

1. Update the state attribute on the element
2. Update any attribute bindings that references the state key
3. Update any handlers that reference the state key, though this is dependent on the handler implementation.

Array and object state types do not have their state attributes updated when they're mutated, however they do still update attribute bindings, and if you update the state attribute programmatically, that state will be sitll be kept in sync.

These are two way binded, meaning if the attribute value is changed outside of the Elements library, Elements will keep it in sync still.

Please keep in mind that the browser will normalise the attribute name to lowercase, so `data-state--isDisabled` is turned into `data-state--isdisabled`. This lowercase attribute name is whats used as the state key and so when referencing it in attribute bindings, you must use the lowercase version.

### Attribute Bindings `data-bind--`

This syntax indicates an attribute binding and takes the name of the variable you want to bind to the attribute.

Please note that the value must always be lowercase.

For example, if you had an attribute binding of `data-bind--disabled="statekey"`, whenever the statekey signal changes, the attribute of `disabled` will be updated to reflect that new value.

### Handlers `data-handler--`

All handlers are prefixed with `data-handler--` and are registered through plugins. By default Elements doesnt register any handlers, but includes a few first-party built-in plugins for event handling, intersection and some DOM manipulation.

The naming is `data-handler--namesapce.specifier="action"`.

These call user defined actions that are set against the store. In the future they may also be able to mutate the state directly, but this will require function constructors meaning you can't use this with the unsafe-eval CSP policy.

## Store Modules

Store modules can be used to extend stores with actions and additional state. They are intended to be used as a layer between your elements and your logic.

Within a store module, any additional state will be added to the store and like state bindings, they will update attribute bindings when their values change.

When a store is initialised, it always attempts to call the `init` action on the store module.

## Reasons to use

- State Attributes Synced: As the state attributes values always reflect the current value, you can use them in CSS with Attribute selectors. Due to the default values as well it means no layout shifts and flashes of content before the library is initialised.
- No Functions In Markup: This may sound like a missing feature, especially compared to a library like AlpineJS. Though we'd argue this is an anti-pattern as, you loose type checking, LSP support without extensions, the ability to compile and bundle the JS, the ability to import modules and depending on the implementation, it doesnt work with the `unsafe-eval` CSP policy.
- Two Way Data Binding: This means you can update the state attributes independently of the library and Elements will keep in sync.
- HTML Spec Compliant: We are HTML spec compliant through the use of data attributes. Though we offer the ability to update the attribute prefixes, so if you dont like the syntax, you can change it to something more suited to your needs.
- SolidJS Reactivity: We make use of SolidJS for reactivity, meaning the library remains performant and light weight.

## Notes

- Children elements to the data-element can only use `data-bind--` and `data-handler--` attributes and not create their own state. // TODO: this isnt true anymore - though maybe it should be?

## TODO:

- [x] Add object and array state support.
- [x] For object/array state types, dont bother update the state attributes at all. The only reason these are kept in sync with state is for CSS attribute selector support, but I dont suspect devs even using these data types for this, it makes sense that should be reserved for booleans, numbers and strings only.
- [x] Parse state attribute values, convert to string, number, boolean, etc.
- [x] Stringify state values when updating attribute bindings.
- [x] Disable state registration on children.
- [x] Optimise the updateBind function - may need attribute map bindings type updated.
- [x] Export SolidJS createSignal, createEffect and createMemo from the library.
- [x] Made storeModule and registerHandler exports instead of the default import for better tree shaking.
- [x] Go through project and address all TODOs.
- [] Add `data-ref="name"` support. If suffixed with a `[]`, push the element to an array.
- [] Disabled nested stores - unless there is a good way to scope attribtues and handlers to the correct store.
- [] Implement solution for plugins and registering handlers.
- [] Add support for function constructors on handler actions - this is optional, by default you should use store module actions. Feature opt-in?
- [] Update entire readme to be better structured and more in-depth.
- [] Add method for re-creating the stores - would be needed for Astro's full site view transitions.
- [] Create some examples of how to use the library and make use of the createSignal, createEffect and createMemo functions.
