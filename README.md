# async-json-cache

A simple cache.

## Usage

It can function as a normal cache.

```ts
import JSONCache from "async-json-cache"

// Initialisation
// The generic argument is how the cached data is stored in the cache.
const cache = new JSONCache<number>()

// Loading from JSON file
cache.loadFromFile("./numbers.json")

// Keys are always strings
cache.get("1")
```

It can be used to cache and retrieve results from an API.

```ts
import JSONCache from "async-json-cache"
import axios from "axios"

interface Result {
  views: number
  time: Date
}
const cache = new JSONCache<Result>()

// Manual updating... boo!
const { data } = axios.get("some api endpoint" + "key")
cache.set("key", data)

// Using JSONCache
function updater(key: string): Promise<Result> {
  const { data } = axios.get("some api endpoint" + "key")
  return data
}
const cache2 = new JSONCache<Result>(updater)
await cache.update("key")
cache.get("key")
```

## Examples

A simple example can be found in [./examples](./examples/).
[`async.ts`](./examples/async.ts) shows how the async update functionality could be used.
