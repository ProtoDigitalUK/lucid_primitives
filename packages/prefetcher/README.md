# Lucid Prefetcher

A streamlined library designed to enhance anchor elements by prefetching the href content as soon as user intent is detected. Additionally, the library features a `Prefetch.Data` class, enabling asynchronous data fetching based on user interactions with specified targets.

## Features

- Prefetch link destinations on user intent
- Prefetch data on user intent

## Getting Started

### Installation

To install the Lucid Prefetcher library, run the following command:

```bash
npm install @lucidclient/prefetcher
```

### Usage

```typescript
import Prefetcher from "@lucidclient/prefetcher";

new Prefetch.Links(); // can pass custom attribute

new Prefetch.Data({
  target: "#get-user",
  fetch: () => {
    return fetch("/api/users").then((res) => res.json());
  },
  onClick: (data) => {
    console.log(data);
  },
  staletime: 60000, // not required
});
```

```html
<a href="/about-me" data-prefetch>Hover me to prefetch </a>
```
