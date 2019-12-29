export interface Filter<T> {
    // must equal value
    eq?: T
    // must be one of given values
    in?: T[]
    // must not be one of given values
    nin?: T[]
}

export interface Filters {
    gender?: Filter<string>
    salary?: Filter<string>
    companySize?: Filter<string>
    workExperience?: Filter<string>
}

export interface FilterQuery<T> {
    // must equal value
    $eq?: T
    // must be one of given values
    $in?: T[]
    // must not be one of given values
    $nin?: T[]
}

export interface FiltersQuery {
    'user_info.gender'?: FilterQuery<string>
    'user_info.company_size'?: FilterQuery<string>
    'user_info.yearly_salary'?: FilterQuery<string>
    'user_info.years_of_experience'?: FilterQuery<string>
}

/**
 * Map natural operators (exposed by the API), to MongoDB operators.
 */
const mapFilter = <T>(filter: Filter<T>): FilterQuery<T> => {
    const q: FilterQuery<T> = {}
    if (filter.eq !== undefined) {
        q['$eq'] = filter.eq
    }
    if (filter.in !== undefined) {
        if (!Array.isArray(filter.in)) {
            throw new Error(`'in' operator only supports arrays`)
        }
        q['$in'] = filter.in
    }
    if (filter.nin !== undefined) {
        if (!Array.isArray(filter.nin)) {
            throw new Error(`'nin' operator only supports arrays`)
        }
        q['$nin'] = filter.nin
    }

    return q
}

/**
 * Generate a MongoDB $match query from filters object.
 */
export const generateFiltersQuery = (filters?: Filters): FiltersQuery => {
    const match: FiltersQuery = {}
    if (filters !== undefined) {
        if (filters.gender !== undefined) {
            match['user_info.gender'] = mapFilter<string>(filters.gender)
        }
        if (filters.companySize !== undefined) {
            match['user_info.company_size'] = mapFilter<string>(filters.companySize)
        }
        if (filters.salary !== undefined) {
            match['user_info.yearly_salary'] = mapFilter<string>(filters.salary)
        }
        if (filters.workExperience !== undefined) {
            match['user_info.years_of_experience'] = mapFilter<string>(filters.workExperience)
        }
    }

    return match
}
