export function isRefPopulated<T>(value: unknown): value is T {
  return typeof value === 'object' && value !== null && !('toHexString' in value);
}

export type Implements<T, U extends T> = U
/*
  [Description]
    Set optional keys on object
  [Examples]
    1. PartialByKeys<{name: string, _id: string, createdAt: string}, '_id'>
      * Sets _id as an optional key on the object
    2. PartialByKeys<{name: string, _id: string, createdAt: string}, 'createdAt' | '_id'>
      * Sets createdAt AND _id as an optional key on the object
*/

export type PartialByKeys<
  TYPE extends Record<PropertyKey, any>,
  KEYS extends keyof TYPE
> = {
    [KEY in keyof (Omit<TYPE, KEYS> & Partial<Pick<TYPE, KEYS>>)]: TYPE[KEY]
  }
