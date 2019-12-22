import { Completion } from './schema'

export interface YearParticipation {
    year: number
    participants: number
}

export interface Participation {
    allYears: YearParticipation[]
    year: YearParticipation
}

/*
"""
Country
"""
type CountryBucket @cacheControl(maxAge: 600) {
    id: String
    count: Int
    percentage: Float
}

type YearCountry @cacheControl(maxAge: 600) {
    year: Int
    total: Int
    completion: Completion
    buckets: [CountryBucket] @cacheControl(maxAge: 600)
}

type Country @cacheControl(maxAge: 600) {
    allYears: [YearCountry]
    year(year: Int!): YearCountry
}

"""
Source
"""
type SourceBucket @cacheControl(maxAge: 600) {
    id: String
    count: Int
    percentage: Float
    entity: Entity
}

type YearSource @cacheControl(maxAge: 600) {
    year: Int
    total: Int
    completion: Completion
    buckets: [SourceBucket] @cacheControl(maxAge: 600)
}

type Source @cacheControl(maxAge: 600) {
    allYears: [YearSource]
    year(year: Int!): YearSource
}

"""
Gender
"""

type GenderBucket @cacheControl(maxAge: 600) {
    id: String
    count: Int
    percentage: Float
}

type YearGender @cacheControl(maxAge: 600) {
    year: Int
    """
    Total number of respondents who have answered this specific question.
    """
    total: Int
    completion: Completion
    buckets: [GenderBucket] @cacheControl(maxAge: 600)
}

type Gender @cacheControl(maxAge: 600) {
    allYears: [YearGender]
    year(year: Int!): YearGender
}
*/

/*
 * Salary
 */

export interface SalaryBucket {
    id: string
    count: number
    percentage: number
}

export interface YearSalary {
    year: number
    total: number
    completion: Completion
    buckets: SalaryBucket[]
}

export interface Salary {
    allYears: YearSalary[]
    year: YearSalary
}

/*
 * Company Size
 */

export interface CompanySizeBucket {
    id: string
    count: number
    percentage: number
}

export interface YearCompanySize {
    year: number
    total: number
    completion: Completion
    buckets: CompanySizeBucket[]
}

export interface CompanySize {
    allYears: YearCompanySize[]
    year: YearCompanySize
}

/*

"""
Experience
"""

type WorkExperienceBucket @cacheControl(maxAge: 600) {
    id: String
    count: Int
    percentage: Float
}

type YearWorkExperience @cacheControl(maxAge: 600) {
    year: Int
    """
    Total number of respondents who have answered this specific question.
    """
    total: Int
    completion: Completion
    buckets: [WorkExperienceBucket] @cacheControl(maxAge: 600)
}

type WorkExperience @cacheControl(maxAge: 600) {
    allYears: [YearWorkExperience]
    year(year: Int!): YearWorkExperience
}

"""
Job Title
"""
type JobTitleBucket @cacheControl(maxAge: 600) {
    id: String
    count: Int
    percentage: Float
}

type YearJobTitle @cacheControl(maxAge: 600) {
    year: Int
    total: Int
    completion: Completion
    buckets: [JobTitleBucket] @cacheControl(maxAge: 600)
}

type JobTitle @cacheControl(maxAge: 600) {
    allYears: [YearJobTitle]
    year(year: Int!): YearJobTitle
}

"""
Proficiency Level
"""
type ProficiencyBucket @cacheControl(maxAge: 600) {
    id: Int
    count: Int
    percentage: Float
}

type YearProficiency @cacheControl(maxAge: 600) {
    year: String
    total: Int
    completion: Completion
    buckets: [ProficiencyBucket] @cacheControl(maxAge: 600)
}

type CSSProficiency @cacheControl(maxAge: 600) {
    allYears: [YearProficiency]
    year(year: Int!): YearProficiency
}

type BackendProficiency @cacheControl(maxAge: 600) {
    allYears: [YearProficiency]
    year(year: Int!): YearProficiency
}

"""
Information about particpants:
- overall participation
- gender
- salary
- company size
- …
"""
type Demographics @cacheControl(maxAge: 600) {
    country: Country @cacheControl(maxAge: 600)
    source: Source @cacheControl(maxAge: 600)
    participation: Participation @cacheControl(maxAge: 600)
    gender: Gender @cacheControl(maxAge: 600)
    salary: Salary @cacheControl(maxAge: 600)
    companySize: CompanySize @cacheControl(maxAge: 600)
    workExperience: WorkExperience @cacheControl(maxAge: 600)
    jobTitle: JobTitle @cacheControl(maxAge: 600)
    cssProficiency: CSSProficiency @cacheControl(maxAge: 600)
    backendProficiency: BackendProficiency @cacheControl(maxAge: 600)
}
*/
