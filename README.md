# async-json-cache

A simple cache.

## Usage

It can function as a normal cache.

```ts
import JSONCache from "async-json-cache"

// Initialisation
// The first generic argument is how the data is stored in the cache.
// The second generic argument is the return type of the get function.
const cache = new JSONCache<number, number>()

// Loading from JSON file
cache.loadFromFile("./numbers.json")

// Keys are always strings
cache.get("1")
```

It can be used to cache and retrieve results from an API.

```ts
import JSONCache from "async-json-cache"
import axios from "axios"

const cache = new JSONCache<number, number>()

// Manual updating... boo!
const { data } = axios.get("some api endpoint" + "key")
cache.set("key", data)

// Using JSONCache
function updater(key: string): Promise<number> {
  const { data } = axios.get("some api endpoint" + "key")
  return data
}
const cache2 = new JSONCache<number, number>(updater)
await cache.update("key")
cache.get("key")
```

## Examples

Two simple examples can be found in [./examples](./examples/).
[`async.ts`](./examples/async.ts) shows how the async functionality could be used, and
[`subclass.ts](./examples/subclass.ts) shows how the cache can be subclassed, with the `get` function returning an instance object.
