import JSONCache from "./jsonCache"

test("gets and sets", () => {
  const cache = new JSONCache<number, number>()
  expect(cache.get("1")).toBeUndefined()
  cache.set("1", 123)
  expect(cache.get("1")).toBe(123)
})

test("deletes", () => {
  const cache = new JSONCache<number, number>()
  expect(cache.delete("1")).toBeFalsy()
  cache.set("1", 123)
  expect(cache.get("1")).toBe(123)
  expect(cache.delete("1")).toBeTruthy()
  expect(cache.get("1")).toBeUndefined()
})

test("loads json strings", () => {
  const cache = new JSONCache<number, number>()
  cache.loadFromString('{"1": 123}')
  expect(cache.get("1")).toBe(123)
  expect(cache.get("2")).toBeUndefined()
})

test("keys and values", () => {
  const cache = new JSONCache<number, number>()
  cache.set("1", 123)
  expect(cache.keys()).toEqual(["1"])
  expect(cache.values()).toEqual([123])
  cache.set("2", 456)
  expect(cache.keys()).toEqual(["1", "2"])
  expect(cache.values()).toEqual([123, 456])
})

test("throws when loading", () => {
  const cache = new JSONCache<number, number>()
  expect(() => cache.loadFromString("\\")).toThrow(SyntaxError)
  expect(() => cache.loadFromString("")).toThrow(SyntaxError)
  expect(() => cache.loadFromFile("iDontExist.json")).toThrow()
})

test("throws when updating with no updater", () => {
  const cache = new JSONCache<number, number>()
  expect(async () => await cache.update("1")).rejects.toThrow()
})

test("async updates", async () => {
  let count = 0
  function updater(_key: string) {
    if (count == 3) {
      count -= 1
      return Promise.reject("failed to update!")
    }
    count = count + 1
    return Promise.resolve(count)
  }

  const cache = new JSONCache<number, number>(updater)
  expect(cache.get("1")).toBeUndefined()
  expect(await cache.update("1")).toBe(1)
  expect(cache.get("1")).toBe(1)
  expect(await cache.getOrUpdate("1")).toBe(1)
  expect(cache.get("1")).toBe(1)
  expect(await cache.getOrUpdate("2")).toBe(2)
  expect(cache.get("2")).toBe(2)
  expect(await cache.update("1")).toBe(3)
  expect(cache.get("1")).toBe(3)
  expect(cache.get("2")).toBe(2)
  expect(async () => await cache.update("2")).rejects.toBe("failed to update!")
  expect(cache.get("2")).toBe(2) // Value did not change after failed update
})
