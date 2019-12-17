export const computeKey = (func, args, options) => {
    const serializedArgs = args ? args.map(a => JSON.stringify(a)).join('_') : ''
    const serializedOptions = options ? JSON.stringify(options) : ''
    return `${func.name}_${serializedArgs}_${serializedOptions}`
}

export const getCachedResult = async (func, db, args, options = {}, enableCache = true) => {
    const key = computeKey(func, args, options)
    try {
        const collection = db.collection('cached_results')
        const existingResult = await collection.findOne({ key })
        if (enableCache && existingResult) {
            console.log(`// Returning existing result for ${key}`)
            return existingResult.value
        } else {
            console.log(`// Getting new result for ${key}`)
            const value = args ? await func(db, options, ...args) : await func(db, options)
            await collection.insertOne({ key, value })
            return value
        }
    } catch (error) {
        console.log(`// Caching error for key ${key}`)
        console.log(error)
    }
}
