# Lucid Speculate 

A streamlined library designed to enhance anchor elements to support prefetching and prerendering. By default this uses the new experimental [Speculation Rules](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/speculationrules) API, but falls back to `<link rel="prefetch">` when not supported. Additionally, the library features a `PrefetchData` class, enabling asynchronous data fetching based on user interactions with specified targets.

## Features

- Prefetch or PreRender documents using Speculation Rules or `<link rel="prefetch">` as a fallback
- Supports `visible`, `immediate`, `eager`, `moderate` and `conservative` triggers
- Prefetch data on use intent (hover, touch, focus)

## Getting Started

### Installation

To install the Lucid Speculate library, run the following command:

```bash
npm install @lucidclient/speculate
```

### Speculate Usage

Initialise the library by calling the `speculateLinks` function.

```typescript
import { speculateLinks } from "@lucidclient/speculate";

speculateLinks();
```

Define the actions and triggers for your links using the `rel` attribute. For each action (prefetch or prerender) you can specify a trigger (visible, immediate, eager, moderate or conservative). For example:

```html
<a href="/page-1" rel="prefetch:visible">I will prefetch when I enter the viewport</a>
<a href="/page-2" rel="prefetch:moderate">I will prefetch when a user interacts with me</a>

<a href="/page-3" rel="prerender:visible">I will prerender when I enter the viewport</a>
<a href="/page-4" rel="prerender:moderate">I will prerender when a user interacts with me</a>
```

Aside from the `visible` trigger, other triggers use the [Speculation Rule Eagerness](https://developer.chrome.com/docs/web-platform/prerender-pages#eagerness) attributes. The only exception is the `moderate` trigger, which uses the `<link rel="prefetch">` fallback when the browser does not support Speculation Rules.

When Speculation Rules are not supported, the only valid triggers are `visible` and `moderate`. The `moderate` trigger is the fallback. The `prerender` action is ONLY supported with Speculation Rules. When Speculation Rules are not supported, they will fallback to `<link rel="prefetch">`.

### Prefetch Data Usage

To use the PrefetchData class, import the `PrefetchData` class and intialise a new instance of it per target.

```typescript
import { PrefetchData } from "@lucidclient/speculate";

new PrefetchData({
    target: "#load-data",
    fetch: () => {
        return fetch("/api/users").then((res) => res.json());
    },
    onClick: (data) => {
        console.log(data);
    },
    staletime: 60000, // optional
});
```

```html
<button 
    id="load-data"
    type="button"
>
    Load Data
</button>
```

## Notes

- Speculation Rules are experimental and currently only supported in Chromium-based browsers. See [Can I Use](https://caniuse.com/mdn-html_elements_script_type_speculationrules) for more information.
- This library makes use of the `<link rel="prefetch">` as a fallback, this is not supported by Safari or iOS Safari.