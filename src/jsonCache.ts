import { readFileSync, writeFileSync } from "fs"

interface CacheItem<V> {
  [key: string]: V
}

export default class JSONCache<V, R> {
  protected cache: CacheItem<V>

  constructor(private getLive?: (k: string) => Promise<V>) {
    this.cache = {}
  }

  public loadFromObject(items: CacheItem<V>) {
    this.cache = items
  }

  public loadFromString(json_str: string) {
    const json = JSON.parse(json_str)
    this.cache = json
  }

  public loadFromFile(filepath: string, encoding: BufferEncoding = "utf8") {
    const json = readFileSync(filepath, encoding)
    this.loadFromString(json)
  }

  public save(filepath: string) {
    const json_str = JSON.stringify(this.cache)
    writeFileSync(filepath, json_str)
  }

  // JSON.stringify() behaviour
  public toJSON() {
    return this.cache
  }

  // Operations
  public get(key: string): V | R | undefined {
    return this.cache[key]
  }

  public async getOrUpdate(key: string): Promise<V | R> {
    const value = this.get(key)
    if (value) return value
    else await this.update(key)
    // If update operation worked, will not be undefined.
    return this.get(key) as V | R
  }

  public set(key: string, value: V): V {
    this.cache[key] = value
    return value
  }

  public async update(key: string): Promise<V> {
    if (!this.getLive) {
      throw new Error("no live update method passed at construction!")
    }

    const value = await this.getLive(key)
    return this.set(key, value)
  }

  public delete(key: string): boolean {
    if (!(key in this.cache)) return false
    delete this.cache[key]
    return true
  }

  public entries() {
    return Object.entries(this.cache)
  }

  public keys(): string[] {
    return Object.keys(this.cache)
  }

  public values(): V[] {
    return Object.values(this.cache)
  }
}
