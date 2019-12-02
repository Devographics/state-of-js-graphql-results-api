import * as Apollo from 'apollo-server'
const { gql } = Apollo.default

export default gql`
    type ExperienceCounts @cacheControl(maxAge: 600) {
        never_heard: Int
        interested: Int
        not_interested: Int
        would_use: Int
        would_not_use: Int
    }
    
    type ExperiencePercentages @cacheControl(maxAge: 600) {
        never_heard: Float
        interested: Float
        not_interested: Float
        would_use: Float
        would_not_use: Float
    }
    
    type ToolYearExperience @cacheControl(maxAge: 600) {
        year: Int
        total: Int
        counts: ExperienceCounts
        percentages: ExperiencePercentages
    }
         
    type Tool @cacheControl(maxAge: 600) {
        id: ID!
        experienceOverYears: [ToolYearExperience] @cacheControl(maxAge: 600)
    }
    
    type YearParticipation @cacheControl(maxAge: 600) {
        year: Int
        participants: Int
    }
    
    type GenderBreakdownBucket @cacheControl(maxAge: 600) {
        id: String
        count: Int
        percentage: Float
    }
    
    type YearGenderBreakdown @cacheControl(maxAge: 600) {
        year: Int
        total: Int
        buckets: [GenderBreakdownBucket] @cacheControl(maxAge: 600)
    }
    
    type Demographics @cacheControl(maxAge: 600) {
        participationByYear: [YearParticipation] @cacheControl(maxAge: 600)
        genderBreakdown: [YearGenderBreakdown] @cacheControl(maxAge: 600)
    }
    
    type Query {
        tool(id: ID!): Tool
        demographics: Demographics 
    }
`
