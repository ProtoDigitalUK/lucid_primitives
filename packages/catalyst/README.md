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
    <button data-events--click="counter:@increment">
        Count: <span data-dom--text="counter:$count"></span>
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

Directive values use an explicit store scope and member type:

```text
store:$state.path
store:@action
store:identifier
```

State is denoted by `$`, actions by `@`, and identifiers are used by refs and
effects.

### Bindings

`data-bind--{attribute}` reactively writes an HTML attribute from state or an
action response.

```html
<a data-bind--href="navigation:$links[0].url">Home</a>
<button data-bind--aria-expanded="navigation:$open">Menu</button>
```

### DOM

```html
<p data-dom--text="profile:$name"></p>
<div data-dom--html="content:@renderHtml"></div>
<input data-dom--value="form:$value" />
<input data-dom--focus="dialog:$open" />
```

Supported specifiers are `text`, `html`, `value`, `focus`, `blur`, and
`scrollto`. Omitting the specifier defaults to `text`.

### Events

```html
<button data-events--click="dialog:@open">Open</button>
<div data-events--document.keydown="dialog:@onKeydown"></div>
<div data-events--window.resize="layout:@onResize"></div>
```

Element events receive the `Event` as the action's first argument. Events can
also target `document`, `body`, `head`, or `window`.

### Refs

```html
<button data-ref="form:submitButton">Submit</button>
<li data-ref="list:items[]"></li>
```

```ts
const button = store.refs.get("submitButton");
const items = store.refs.get("items");
```

Refs are registered before the store's optional `init` action runs.

### Effects

Manual effects are activated with `data-effects`:

```html
<div data-effects="dialog:onOpenChange"></div>
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
<ul data-loop="navigation:$links">
    <template>
        <li>
            <a
                data-bind--href="navigation:$links[:index:].url"
                data-dom--text="navigation:$links[:index:].title"
            ></a>
        </li>
    </template>
</ul>
```

`:index:` is zero-based and `:indexOne:` is one-based. Nested template contents
retain their own index placeholders until their loop renders. Inside a nested
template, use `:index-1:` for its parent's zero-based index or `:indexOne-1:`
for its parent's one-based index. Increase the suffix for each additional
ancestor, for example `:index-2:`.

### Focus traps

```html
<div data-trap="dialog:$open"></div>
<div data-trap--both="dialog:$open"></div>
```

`both` traps the element while true and makes the target inert while false.

## Dynamic markup and lifecycle

Use `sync` after adding markup outside Catalyst:

```ts
target.innerHTML = `<button data-events--click="nav:@select">Select</button>`;
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

A reaction can alternatively be passed through `Catalyst.start({ reactions })`.
