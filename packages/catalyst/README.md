# Catalyst

> Part of the Lucid Client suite

A lightweight reactive UI library that connects HTML attributes to typed
JavaScript store modules. Catalyst uses SolidJS signals for reactivity while
keeping application logic out of markup.

## Installation

```bash
npm install @lucidclient/catalyst
```

## Getting started

```ts
import Catalyst, { storeModule } from "@lucidclient/catalyst";
import { dom, events } from "@lucidclient/catalyst/reactions";

storeModule("counter", (store) => ({
    actions: {
        increment: () => {
            const [, setCount] = store.state.count;
            setCount((count) => count + 1);
        },
    },
}));

Catalyst.start({ reactions: [events, dom] });
```

```html
<div data-store="counter" data-state--count="0">
    <button data-events--click="@increment">
        Count: <span data-dom--text="$count"></span>
    </button>
</div>
```

Reactions are registered explicitly, so an application only includes the
behavior it uses. Catalyst exports `refs`, `bind`, `effects`, `loop`, `events`,
`dom`, and `trap` from `@lucidclient/catalyst/reactions`.

## Stores and state

`data-store` creates a scoped store. State declared with `data-state--*` is
parsed into its inferred JavaScript type and kept synchronized with its SolidJS
signal in both directions.

```html
<div
    data-store="profile"
    data-state--name="Ada"
    data-state--active="true"
    data-state--visits="3"
    data-state--links='[{"title":"Home","url":"/"}]'
></div>
```

Store modules add typed state and application logic:

```ts
import { createSignal, storeModule } from "@lucidclient/catalyst";

type ProfileState = {
    name: string;
    active: boolean;
    visits: number;
    status: string;
};

type ProfileActions = {
    toggle: () => void;
};

storeModule<ProfileState, ProfileActions>("profile", (store) => ({
    state: {
        status: createSignal("ready"),
    },
    actions: {
        toggle: () => {
            const [, setActive] = store.state.active;
            setActive((active) => !active);
        },
    },
}));
```

Store-module state takes precedence over a matching state attribute. Stores
must have unique scope names, including when they are nested.

## Reaction attributes

All behavior uses the same attribute grammar:

```text
data-{reaction}
data-{reaction}--{specifier}
```

Directive values use a symbol to identify their member type:

```text
$state.path
@action
#identifier
```

The nearest `data-store` scope is inferred. State is denoted by `$`, actions by
`@`, and named references used by refs and effects are denoted by `#`. Bare
values remain literal values for custom reactions.

Prefix a reference with a scope when it needs to cross a store boundary:

```text
profile:$name
dialog:@open
form:#submitButton
```

### Bindings

`data-bind--{attribute}` reactively writes an HTML attribute from state or an
action response.

```html
<nav data-store="navigation">
    <a data-bind--href="$links[0].url">Home</a>
    <button data-bind--aria-expanded="$open">Menu</button>
</nav>
```

### DOM

```html
<section data-store="profile">
    <p data-dom--text="$name"></p>
    <div data-dom--html="@renderHtml"></div>
    <input data-dom--value="$value" />
    <input data-dom--focus="$open" />
</section>
```

Supported specifiers are `text`, `html`, `value`, `focus`, `blur`, and
`scrollto`. Omitting the specifier defaults to `text`.

### Events

```html
<div data-store="dialog">
    <button data-events--click="@open">Open</button>
    <div data-events--document.keydown="@onKeydown"></div>
    <div data-events--window.resize="@onResize"></div>
</div>
```

Element events receive the `Event` as the action's first argument. Events can
also target `document`, `body`, `head`, or `window`.

### Refs

```html
<form data-store="form">
    <button data-ref="#submitButton">Submit</button>
    <input data-ref="#fields[]" />
</form>
```

```ts
const button = store.refs.get("submitButton");
const fields = store.refs.get("fields");
```

Refs are registered before the store's optional `init` action runs.

### Effects

Manual effects are activated with `data-effects`:

```html
<div data-store="dialog">
    <div data-effects="#onOpenChange"></div>
</div>
```

```ts
storeModule("dialog", (store) => ({
    actions: {},
    effects: {
        manual: {
            onOpenChange: ({ isInitial }) => {
                const [open] = store.state.open;
                console.log(open(), isInitial);
            },
        },
        global: {
            analytics: ({ isInitial }) => {
                console.log("Store effect", isInitial);
            },
        },
    },
}));
```

Global effects run whenever the effects reaction is registered. Duplicate
references to the same store effect share one reactive effect.

### Loops

`data-loop` resolves an array and renders its direct `<template>` child once per
item.

```html
<nav data-store="navigation">
    <ul data-loop="$links">
        <template>
            <li>
                <a
                    data-bind--href="$item.url"
                    data-bind--data-index="$index"
                    data-dom--text="$item.title"
                ></a>
            </li>
        </template>
    </ul>
</nav>
```

Each rendered template receives `$item`, `$index`, and `$indexOne`. Nested loops
can access their enclosing context through `$parent.item`, `$parent.index`, and
`$parent.indexOne`. Parent traversal can be repeated for deeper nesting, for
example `$parent.parent.item`.

```html
<ul data-loop="$groups">
    <template>
        <li>
            <h2 data-dom--text="$item.title"></h2>
            <ul data-loop="$item.links">
                <template>
                    <li>
                        <a
                            data-bind--href="$item.url"
                            data-bind--data-group="$parent.item.title"
                            data-dom--text="$item.title"
                        ></a>
                    </li>
                </template>
            </ul>
        </li>
    </template>
</ul>
```

### Focus traps

```html
<div data-store="dialog">
    <div data-trap="$open"></div>
    <div data-trap--both="$open"></div>
</div>
```

`both` traps the element while true and makes the target inert while false.

## Dynamic markup and lifecycle

Use `sync` after adding markup outside Catalyst:

```ts
target.innerHTML = `<button data-events--click="@select">Select</button>`;
Catalyst.sync(target);
```

Repeated synchronization is idempotent. Removed subtrees automatically dispose
their event listeners, reactive effects, refs, and nested stores.

```ts
Catalyst.refresh();
Catalyst.refresh("storeScope");
Catalyst.destroy();
```

`destroy` resets the running instance so it can be started again. Registered
store modules and reaction definitions remain available.

## Configuration

```ts
Catalyst.start({
    debug: true,
    reactions: [events, dom],
    attributes: {
        prefix: "data-",
        store: "store",
        state: "state--",
        scopeSeparator: ":",
        specifierSeparator: "--",
    },
});
```

Reaction attribute names are owned by their reaction definitions rather than by
core configuration.

## Custom reactions

Custom reactions receive the same concrete directive data as Catalyst's
first-party reactions:

```ts
import Catalyst, { registerReaction } from "@lucidclient/catalyst";
import type { Reaction } from "@lucidclient/catalyst/types";

const classList: Reaction = {
    name: "classList",
    attribute: "class-list",
    setup: ({ element, value }) => {
        element.classList.add(value);
        return () => element.classList.remove(value);
    },
};

registerReaction(classList);
Catalyst.start();
```

```html
<div data-class-list="is-active"></div>
```

Because `is-active` has no `$`, `@`, or `#` prefix, it remains a literal value
and `directive.reference` is `null`. A reaction can alternatively be passed
through `Catalyst.start({ reactions })`.
