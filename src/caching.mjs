export const computeKey = (func, args) => {
    const serializedArgs = args ? args.map(a => JSON.stringify(a)).join('_') : ''
    return `${func.name}_${serializedArgs}`
}

export const getCachedResult = async (func, db, args, enableCache = true) => {
    const key = computeKey(func, args)
    try {
        const collection = db.collection('cached_results')
        const existingResult = await collection.findOne({ key })
        if (enableCache && existingResult) {
            console.log(`// Returning existing result for ${key}`)
            return existingResult.value
        } else {
            console.log(`// Getting new result for ${key}`)
            const value = args ? await func(db, ...args) : await func(db)
            await collection.insertOne({ key, value })
            return value
        }
    } catch (error) {
        console.log(`// Caching error for key ${key}`)
        console.log(error)
    }
}
