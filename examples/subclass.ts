import JSONCache from "../src/jsonCache"

interface PointCacheItem {
  x: number
  y: number
}

class Point {
  constructor(public x: number, public y: number) {}

  public toString() {
    return `x: ${this.x}, y: ${this.y}`
  }
}

class PointCache extends JSONCache<PointCacheItem, Point> {
  constructor() {
    super()
  }

  override get(key: string): Point | undefined {
    const item = super.get(key)
    if (!item) return
    // Returns a new object! Not ideal for extensive usage.
    return new Point(item.x, item.y)
  }
}

const cache = new PointCache()
cache.set("1", { x: 4, y: 5 })
const point = cache.get("1")
console.log(point?.toString())
