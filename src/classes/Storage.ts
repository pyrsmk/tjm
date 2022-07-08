/* eslint-disable @typescript-eslint/no-explicit-any */
import { isProxy, toRaw } from 'vue'
import type StorageInterface from './StorageInterface'

export default class Storage implements StorageInterface {
  async set(key : string, value : any) : Promise<void> {
    localStorage.setItem(key, JSON.stringify(this.serialize(value)))
  }

  async get(key : string) : Promise<any> {
    const value = localStorage.getItem(key)
    if (value === null) {
      throw new Error(`'${key}' value does not exist in storage`)
    }
    return this.deserialize(JSON.parse(value))
  }

  async remove(key : string) : Promise<void> {
    localStorage.removeItem(key)
  }

  async clear() : Promise<void> {
    localStorage.clear()
  }

  // Quick and ugly serialization procedure, since the quickly viewed NPM libs seems
  // unusable.
  private serialize(value : any) : any {
    // Vue's proxy serialization.
    if (isProxy(value)) {
      return this.serialize(toRaw(value))
    }
    // Objects serialization.
    if (typeof value == 'object' && value !== null) {
      // Array serialization.
      if (Array.isArray(value)) {
        return value.map(v => this.serialize(v))
      }
      // Map serialization.
      if (value.constructor.name == 'Map') {
        const serializedMap = Array.from(value.entries())
        // If the serialized map is empty, we identify it with `[[null, null]]` instead
        // of `[]`.
        return serializedMap.length == 0 ? [[null, null]] : serializedMap
      }
      // Object serialization (shadow mutation free).
      const object : { [k: string]: any } = {}
      for (const k in value) {
        object[k] = this.serialize(value[k])
      }
      return object
    }
    // Any other value is returned as-is.
    return value
  }

  private deserialize(value : any) : any {
    // Deserialize objects.
    if (typeof value == 'object' && value !== null) {
      // Map deserialization routine.
      if (this.isSerializedMap(value)) {
        if (value[0][0] === null && value[0][1] === null) {
          return new Map()
        }
        return new Map(value)
      }
      // Array deserialization.
      if (Array.isArray(value)) {
        return value.map(v => this.deserialize(v))
      }
      // Object deserialization (shadow mutation free).
      const object : { [k: string]: any } = {}
      for (const k in value) {
        object[k] = this.deserialize(value[k])
      }
      return object
    }
    // Return any other value as-is.
    return value
  }

  private isSerializedMap(value : any) : boolean {
    // Not an array, or is an empty array.
    if (!Array.isArray(value) || value.length == 0) {
      return false
    }
    // We only handle array of arrays with two values for each row.
    for (const row of value) {
      if (!Array.isArray(row) || row.length != 2) {
        return false
      }
    }
    return true
  }
}
