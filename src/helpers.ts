/*
  A simple function that marks a callback as busy to avoid calling it multiple times
  before it has finished its task.
*/
const busyCallbacks = new Set()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function busy(callback : () => any) : Promise<any> {
  if (busyCallbacks.has(callback)) {
    return
  }
  busyCallbacks.add(callback)
  const value = await callback()
  busyCallbacks.delete(callback)
  return value
}

export function toEuros(value : number) : string {
  return `${value.toFixed(2)} €`
}
