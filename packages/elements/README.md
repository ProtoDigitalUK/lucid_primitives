# Lucid Elements


```html
<div
    $on:click="handleClick"
    $on:mouseover="handleMouseover"
    $on:mouseout="handleMouseout"
    $attr:disabled="disabled === true"
    $attr:aria-expanded="detailsState"
    $intersect:load="loadDetails"
    $class="{ detailsState ? 'bg-indigo-500' : 'bg-white' }"
>
    <p>Hello World</p>
</div>
```
> Just experimenting with syntax - nothing decided yet