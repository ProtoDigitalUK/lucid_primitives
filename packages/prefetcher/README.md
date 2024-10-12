# Lucid Prefetcher

A streamlined library designed to enhance anchor elements by prefetching the href content as soon as user intent is detected. Additionally, the library features a `PrefetchData` class, enabling asynchronous data fetching based on user interactions with specified targets.

## Features

- Prefetch link destinations on user intent (hover, touch, focus)
- Basic support for [Speculation Rules](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/speculationrules)
- Prefetch data on user intent

## Getting Started

### Installation

To install the Lucid Prefetcher library, run the following command:

```bash
npm install @lucidclient/prefetcher
```

### Usage

```typescript
import { PrefetchLinks, PrefetchData } from "@lucidclient/prefetcher";

new PrefetchLinks();

new PrefetchDatai({
  target: "#get-user",
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
<a 
    href="/about-me" 
    rel="prefetch-intent"
>
    Hover me to prefetch
</a>
```

### Notes

- This library makes use of the <Link rel="prefetch" /> tag, which is not yet supported by all browsers. Mainly Safari and iOS Safari.
- If you're using [Astro](https://astro.build), you should use the astro:prefetch built in package instead as this has fallbacks for Safari & IOS along with support for prefetching stylesheets.