import { Db } from 'mongodb'

const CACHE_COLLECTION = 'cached_results'

type DynamicComputeCall = (db: Db, ...args: any[]) => Promise<any>

type ArgumentTypes<F> = F extends (db: Db, ...args: infer A) => Promise<any> ? A : never

type ResultType<F> = F extends (...args: any[]) => infer P
    ? P extends Promise<infer R>
        ? R
        : never
    : never

/**
 * Compute a cache key from a function and its arguments,
 * the function should have a name in order to generate a proper key.
 */
export const computeKey = (func: Function, args?: any) => {
    const serializedArgs = args
        ? args
              .map((a: any) => {
                  return JSON.stringify(a)
              })
              .join(', ')
        : ''

    if (func.name === '') {
        console.trace(
            `found a function without name, please consider using a regular function instead of an arrow function to solve this issue as it can lead to cache mismatch`
        )
    }

    return `${func.name}(${serializedArgs})`
}

export const getCachedResult = async <F extends DynamicComputeCall>(
    func: F,
    db: Db,
    args: ArgumentTypes<F>
): Promise<ResultType<F>> => {
    const key = computeKey(func, args)

    const collection = db.collection(CACHE_COLLECTION)
    const existingResult = await collection.findOne({ key })
    if (existingResult) {
        console.log(`< using result from cache for: ${key}`)

        return existingResult.value
    }

    console.log(`> fetching/caching result for: ${key}`)
    const value = await func(db, ...(args || []))

    // in case previous cached entry exists, delete it
    await collection.deleteOne({ key })
    await collection.insertOne({ key, value })

    return value
}
