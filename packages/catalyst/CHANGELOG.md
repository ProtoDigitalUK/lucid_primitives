# @lucidclient/catalyst

## v0.6.0 (unreleased)

### Minor Changes

- Renamed the package from `@lucidclient/elements` to
  `@lucidclient/catalyst`.
- Removed the all-in preset so consumers explicitly register only the reactions
  they use.
- Reworked all non-store/state behavior into first-party reactions that consume
  one element-scoped directive format.
- Simplified reaction attributes to `data-{reaction}--{specifier}`, including
  `data-events--click`, `data-dom--text`, and `data-effects`.
- Rebuilt dynamic synchronization so reactions are idempotent and are disposed
  with their owning elements.
- Fixed state bindings inside loop templates, including nested paths such as
  `data-bind--href="store:$items[:index:].url"` when the array comes from a
  store-module signal.
- Added explicit ancestor indexes for nested loops through `:index-1:` and
  `:indexOne-1:` placeholders.
- Kept primitive, object, and array state attributes synchronized without using
  state mutations to drive bindings.
- Added automated coverage for directive reference parsing, loop bindings,
  two-way state, and ref initialization order.

## v0.5.1

### Patch Changes

- Fixed bug where in watch state setup, if the state was of type array/object we returned instead of continuing. This is responsible for keeping `data-state` attributes and subsequently `data-bind` in sync.

## v0.5.0

## Minor Changes

- Added support for the `data-loop` directive.
- Fixed bug where data-bind directives wouldnt work for any state registered through the store modules as opposed to data-state.
- DOM handler focus is now wrapped in a setTimeout so its delayed slightly. This means if its used within a trap target it still works.

## v0.4.0

### Minor Changes

- Added the concept of global and manual effects. Global effects are always initialised, while manual one need to be called via a `data-effect="scope:manulEffect"` attribute.

## v0.3.1

### Patch Changes

- Fixed indentation in README.

## v0.3.0

### Minor Changes

- Added support for handler specifiers to include multiple specifiers seperated by dot notation.
- All helpers are now exported. This means everything you may need to create third-party handlers can now be accessed.
- Event handler now supports registering event handlers on `document`, `body`, `window` and `head` by prefixing the event name with the target. Ie. `data-handler--event.document.click="myAction"`.
- Breaking change: all state values in `data-bind--` attributes must be prefixed with `$`. Ie. `data-bind--aria-label="scope:$state"`.
- All first-party handlers now support using state as well as actions. Just prefix the value with either a `$` or `@` to denote the member type.
- Added a new first party handler for trapping focus. This can be used via the `data-handler--trap` attribute and supports both member types.
- Added a new optional cleanup callback for store modules.
- Added a new `data-effect` attribute for registering effects through attributes.
- Added support for handlers to be registered through `Catalyst.start`.
