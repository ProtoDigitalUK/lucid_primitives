# Lucid Elements

> This is currently an experimental library, and is not recommended for production use as it may not go anywhere.

```
<div
    <!-- link up to store to define functions and access state -->
    $store="elementStore"

    <!-- live state -->
    $state:disabled="false"
    $state:expanded="false"

    <!-- treated as functions -->
    $on:click="handleClick"
    $on:mouseover="handleMouseover"
    $on:mouseout="handleMouseout"
    $intersect:enter="enteredViewport"
    $intersect:leave="leftViewport"
    $intersect:center="centeredViewport"

    <!-- treated as values -->
    $attr:disabled="disabled"
    $attr:aria-expanded="expanded"
    $attr:custom-attribute-name="disabled"

    <!-- classes should be toggled through attribute state -->
    class="[&[$state\:disabled]]:bg-red-500"
>
    <p>Hello World</p>
</div>
```
> Potential syntax?

## Notes

- Use SolidJS for reactivity.
- State attributes are updated on state changes allowing them to be used with CSS. (example above with Tailwind).
- Due to CSP unsafe-eval, avoid conditionals, defining functions, etc, in the template which would require eval() or new Function() to be called. Alternative is parsing the string to determine var, conditions etc. but this would mean implementing each conditional, currently understanding different syntaxes would be required.
- There probably needs to be some syntax for determining whats treated as a function and whats treated as a value. Alternative is it just depends on the prefix ie: attr, on, intersect etc.
