import * as Apollo from 'apollo-server'
const { gql } = Apollo.default

export default gql`
    type ToolExperienceBucket @cacheControl(maxAge: 600) {
        id: String
        count: Int
        percentage: Float
    }
    
    type ToolYearExperience @cacheControl(maxAge: 600) {
        year: Int
        total: Int
        buckets: [ToolExperienceBucket] @cacheControl(maxAge: 600)
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
