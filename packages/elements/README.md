# Lucid Elements

> This is currently an R&D library, and is not recommended for production use as it may not go anywhere. Syntax, APIs and functionality is subject to change.

## Getting Started

```typescript
import Elements, { createSignal } from "@lucidclient/elements";
import { EventHandlers, IntersectionHandlers, DOMHandlers } from "@lucidclient/elements/plugins";

// register plugins for handers
Elements.register(EventHandlers);
Elements.register(IntersectionHandlers);
Elements.register(DOMHandlers);

// if you're using typescript you can pass a generic type to the store
Elements.store<{
  disabled: boolean;
  customState: string;
}>('exampleStore', (instance) => ({
  state:
  	customState: createSignal('hello world')
	},
  actions: {
    handleClick: () => {
      const [_, setDisabled] = instance.state.disabled;

      setDisabled(true);
    }
  }
}));


// start the library
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

    data-handler--on.click="handleClick"
    data-handler--on.mouseover="handleMouseover"
    data-handler--on.mouseout="handleMouseout"

    data-handler--intersect.enter="enteredViewport"
    data-handler--intersect.leave="leftViewport"
    data-handler--intersect.center="centeredViewport"

    data-bind--disabled="disabled"
    data-bind--aria-expanded="expanded"
    data-bind--data-custom-attribute-name="disabled"

    class="data-[state-disabled=true]:bg-red-500"
>
    <div
        data-bind--data-expanded
        class="data-[expanded=true]:h-full"
    >
        <p>Hello World</p>
    </div>
    <button
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
3. Update any handlers that reference the state key (this is not yet implemented)

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

## Reasons to use

- State Attributes Synced: As the state attributes values always reflect the current value, you can use them in CSS with Attribute selectors. Due to the default values as well it means no layout shifts and flashes of content before the library is initialised.
- No Functions In Markup: This may sound like a missing feature, especially compared to a library like AlpineJS. Though we'd argue this is an anti-pattern as, you loose type checking, LSP support without extensions, the ability to compile and bundle the JS, the ability to import modules and depending on the implementation, it doesnt work with the `unsafe-eval` CSP policy.
- Two Way Data Binding: This means you can update the state attributes independently of the library and Elements will keep in sync.
- HTML Spec Compliant: We are HTML spec compliant through the use of data attributes. Though we offer the ability to update the attribute prefixes, so if you dont like the syntax, you can change it to something more suited to your needs.
- SolidJS Reactivity: We make use of SolidJS for reactivity, meaning the library remains performant and light weight.

## Notes

- Children elements to the data-element can only use `data-bind--` and `data-handler--` attributes and not create their own state. // TODO: this isnt true anymore - though maybe it should be?
