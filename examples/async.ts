import JSONCache from "../src/jsonCache"

const sleep = (t: number) => new Promise((resolve) => setTimeout(resolve, t))

// Sample async update function.
// Could be a request to an API.
let count = 0
async function updater(key: string) {
  await sleep(1_000)
  if (count == 3) {
    count -= 1
    return Promise.reject("failed to update, count = 3!")
  }
  count += 1
  return Promise.resolve(count)
}

const cache = new JSONCache<number>(updater)
console.log(cache.get("1")) // undefined
console.log(cache.set("1", 1000)) // 1000
console.log(await cache.update("1")) // 1, after a delay of 1 second.
console.log(cache.get("1")) // 1, without a delay.
console.log(await cache.getOrUpdate("1")) // 1, without a delay.
console.log(await cache.update("1")) // 2, after a delay of 1 second.
