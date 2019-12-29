export interface Filters {
    gender?: string
    salary?: string
    companySize?: string
    workExperience?: string
}

export interface FiltersQuery {
    'user_info.gender'?: string
    'user_info.company_size'?: string
    'user_info.yearly_salary'?: string
    'user_info.years_of_experience'?: string
}

export const generateFiltersQuery = (filters?: Filters): FiltersQuery => {
    const match: FiltersQuery = {}
    if (filters !== undefined) {
        if (filters.gender !== undefined) {
            match['user_info.gender'] = filters.gender
        }
        if (filters.companySize !== undefined) {
            match['user_info.company_size'] = filters.companySize
        }
        if (filters.salary !== undefined) {
            match['user_info.yearly_salary'] = filters.salary
        }
        if (filters.workExperience !== undefined) {
            match['user_info.years_of_experience'] = filters.workExperience
        }
    }

    return match
}
