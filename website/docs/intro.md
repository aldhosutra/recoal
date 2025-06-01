---
sidebar_position: 1
---

![Header](https://raw.githubusercontent.com/aldhosutra/reqoal/HEAD/website/static/img/docusaurus-social-card.jpg)

# reqoal

![Repo Size](https://img.shields.io/github/repo-size/aldhosutra/reqoal)
[![License: MIT](https://img.shields.io/github/license/aldhosutra/reqoal?color=green)](https://opensource.org/license/mit)

A lightweight and efficient JavaScript/TypeScript library for request coalescing — merge concurrent identical async calls into a single request to reduce load and improve performance.

## Features

- Coalesce concurrent or repeated calls for the same function and arguments
- Supports both async and sync functions
- Caches results for a configurable TTL
- Periodically prunes expired cache entries (automatic memory management)
- Manual cache invalidation and pruning
- Custom key generator for advanced cache strategies
- Concurrency limit per instance
- ESM & CJS compatible
- TypeScript-first, with full type safety

## Installation

```sh
npm install reqoal
```

## Usage

### Global Instance (Simple)

```ts
import { coalesce, isCoalesced, invalidate, clear, prune, setKeyGenerator } from 'reqoal';

// Async or sync function
async function fetchUser(id) {
	/* ... */
}
function add(a, b) {
	return a + b;
}

// Coalesce requests
const user = await coalesce(fetchUser, 123);
const sum = await coalesce(add, 1, 2); // works with sync too!

// Check if a request is in-flight or cached
const active = isCoalesced(fetchUser, 123);

// Invalidate cache for a specific call
invalidate(fetchUser, 123);

// Clear all cache and in-flight requests
clear();

// Manually prune expired cache entries (optional)
prune();

// Set a custom key generator (advanced)
setKeyGenerator((functionName, ...args) => `${functionName}:${args.join('-')}`);
```

### Custom Instance (Advanced)

```ts
import { ReqoalInstance } from 'reqoal';

const coalescer = new ReqoalInstance(
	60000, // prune interval (ms)
	1000, // TTL (ms)
	console, // custom logger
	5, // max concurrency
);

await coalescer.coalesce(fetchUser, 123);
coalescer.setKeyGenerator((functionName, ...args) => `${functionName}:${args.join('-')}`);
```

## API

### Global Exports

- `coalesce(fn, ...args)` — Coalesce and cache requests
- `isCoalesced(fn, ...args)` — Check if a request is in-flight or cached
- `invalidate(fn, ...args)` — Invalidate cache for a specific call
- `clear()` — Clear all cache and in-flight requests
- `prune()` — Manually prune expired cache entries
- `setKeyGenerator(fn)` — Set a custom key generator

### ReqoalInstance

- `new ReqoalInstance(intervalMs?, ttlMs?, consoler?, maxConcurrency?)`
- `.coalesce(fn, ...args)`
- `.isCoalesced(fn, ...args)`
- `.invalidate(fn, ...args)`
- `.clear()`
- `.prune()`
- `.setKeyGenerator(fn)`

## ESM & CJS Compatibility

- ESM: `import { coalesce } from 'reqoal'`
- CJS: `const { coalesce } = require('reqoal')`

## License

MIT

## Links

- [GitHub Repository](https://github.com/aldhosutra/reqoal)
- [Documentation](https://reqoal.js.org)
- [Report Issues](https://github.com/aldhosutra/reqoal/issues)
