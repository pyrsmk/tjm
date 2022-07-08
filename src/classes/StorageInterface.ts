/* eslint-disable @typescript-eslint/no-explicit-any */
export default interface StorageInterface {
  set(key : string, value : any) : Promise<void>
  get(key : string) : Promise<any>
  remove(key : string) : Promise<void>
  clear() : Promise<void>
}
