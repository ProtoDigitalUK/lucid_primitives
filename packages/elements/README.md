# Lucid Elements

> This is currently an R&D library, and is not recommended for production use as it may not go anywhere.

## Getting Started

```typescript
import Elements from "@lucidclient/elements";
import {
    EventHandlers,
    IntersectionHandlers,
    DOMHandlers,
} from "@lucidclient/elements/plugins";

Elements.register(EventHandlers);
Elements.register(IntersectionHandlers);
Elements.register(DOMHandlers);

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

> The top level div is marked as `elements="elementStore"`, this tells elements to link this to the given store. Use the `elements` attribute by itself to denote that the element is the root element.

### State Bindings `data-state--`

These indicate a variable that exists in the store. These are reactive and available to the element and child elements through handlers and attribute bindings.

Please keep in mind that the browser will normalise the attribute name to lowercase, so `data-state--isDisabled` is turned into `data-state--isdisabled`. This lowercase attribute name is whats used as the state key and so when referencing it in attribute bindings, you must use the lowercase version.

### Handlers `data-handler--`

All handlers are prefixed with a `data-handler--` and are registered through plugins. By default Elements doesnt register any handlers, but includes a few first-party built-in plugins for event handling, intersection and some DOM manipulation.

The naming is `data-handler--namesapce.specifier="handler"`.

These call functions on the store, but can also mutate the store directly. If you have the unsafe-eval CSP policy enabled, you must use handlers as functions only as function constructors are not allowed.

### Attribute Bindings `data-bind--`

This syntax indicates an attribute binding and takes the name of the variable you want to bind to the attribute.

## Reasons to use

- Reactive attrribute state for CSS toggling. The benefit of this is default state is available before the library is initialised, meaning it can be used in CSS without layout shifts and content flashing.
- We are HTML spec compliant through the use of data attributes.
- Unlike some other similar libraries, we do not support defining functions in the markup. This is because you loose the ability to type check, have LSP support without extensions and compile and bundle your logic. This functionality also means you can't use the unsafe-eval CSP policy.

## Notes

- Use SolidJS for reactivity.
- The recommended method to manage class toggling is through using CSS attribute selectors.
- Children elements to the data-element can only use `data-bind--` and `data-handler--` attributes and not create their own state.
