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

Elements.start();
```

## Syntax Breakdown

```html
<div
    <!-- Link to store -->
    $store="elementStore"
    
    <!-- State variables -->
    $disabled="false"
    $expanded="false"
    
    <!-- Event handlers -->
    @on:click="handleClick"
    @on:mouseover="handleMouseover"
    @on:mouseout="handleMouseout"
    
    <!-- Intersection observers -->
    @intersect:enter="enteredViewport"
    @intersect:leave="leftViewport"
    @intersect:center="centeredViewport"
    
    <!-- Attribute bindings -->
    :disabled="disabled"
    :aria-expanded="expanded"
    :custom-attribute-name="disabled"

    <!-- classes should be toggled through attribute state -->
    class="[&[\$expanded=true]]:h-full"
>
    <div
        $expanded <!-- subscribe to state -->
        class="[&[\$expanded=true]]:h-full"
    >
        <p>Hello World</p>
    </div>
    <button 
        @on:click="handleClick"
        @dom:innerText="$expanded ? 'Hide Content' : 'Show Content'"
    >
        Show Content
    </button>
</div>
```

### State Bindings `$`

These indicate a variable that exists in the store. These are reactive and available to the element and child elements.

The $store variable is a reserved keyword for linking a store to the element. This is where you define functions and where complexity should be handled.

### Handlers `@`

All handlers are prefixed with a `@` and are registered through plugins. By default Elements doesnt register any handlers, but includes a few first-party built-in plugins for event handling, intersection and some DOM manipulation.

The naming is `@namesapce:specifier="handler"`.

These call functions on the store, but can also mutate the store directly. If you have the unsafe-eval CSP policy enabled, you must use handlers as functions only as function constructors are not allowed.

### Attribute Bindings `:`

This syntax indicates an attribute binding and takes the name of the variable you want to bind to the attribute.

## Reasons to use

- Reactive attrribute state for CSS toggling. The benefit of this is default state is available before the library is initialised, meaning it can be used in CSS without layout shifts and content flashing.
- Unlike some other similar libraries, we do not support defining functions in the markup. This is because you loose the ability to type check, have LSP support without extensions and compile and bundle your logic. This functionality also means you can't use the unsafe-eval CSP policy.

## Notes

- Use SolidJS for reactivity.
- The recommended method to manage class toggling is through using CSS attribute selectors.
