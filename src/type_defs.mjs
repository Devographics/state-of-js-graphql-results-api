import * as Apollo from 'apollo-server'
const { gql } = Apollo.default

export default gql`
    """
    An aggregation bucket for tool experience containing both an absolute count
    for the parent year, and the percentage it corresponds to regarding
    the total number of respondents who have answered the question
    in this particular year.
    """
    type ToolExperienceBucket @cacheControl(maxAge: 600) {
        id: String
        count: Int
        percentage: Float
    }
    
    """
    Experience ranking for a tool in a specific year, even if the data 
    is computed at the same point in time, we estimate that there is a logical
    progression in this:
        
    awareness > interest > satisfaction
    """
    type ToolAwarenessInterestSatisfaction @cacheControl(maxAge: 600) {
        """
        Awareness is the total number of participants who answered to
        the experience question VS those who never heard of a tool.
        
        This value is expressed as a percentage.
        """
        awareness: Float
        """
        Interest is the ratio of participants who heard of tool and
        are interested/not interested VS those who are only interested in it.
        
        This value is expressed as a percentage.
        """
        interest: Float
        """
        Satisfaction is the ratio of participants who used of tool and
        are satisfied/not satisfied VS those who are willing to use it again.
        
        This value is expressed as a percentage.
        """
        satisfaction: Float
    }
    
    type ToolYearExperience @cacheControl(maxAge: 600) {
        year: Int
        """
        Total number of respondents who have answered this specific question.
        """
        total: Int
        completion: Float
        buckets: [ToolExperienceBucket] @cacheControl(maxAge: 600)
        awarenessInterestSatisfaction: ToolAwarenessInterestSatisfaction 
    }
         
    type Tool @cacheControl(maxAge: 600) {
        id: ID!
        experience: [ToolYearExperience] @cacheControl(maxAge: 600)
    }
    
    type FeatureUsageBucket @cacheControl(maxAge: 600) {
        id: String
        count: Int
        percentage: Float
    }
    
    type FeatureYearUsage @cacheControl(maxAge: 600) {
        year: Int
        """
        Total number of respondents who have answered this specific question.
        """
        total: Int
        completion: Float
        buckets: [FeatureUsageBucket] @cacheControl(maxAge: 600)
    }
    
    type Feature @cacheControl(maxAge: 600) {
        id: ID!
        section: String
        usageByYear: [FeatureYearUsage] @cacheControl(maxAge: 600) 
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
        """
        Total number of respondents who have answered this specific question.
        """
        total: Int
        completion: Float
        buckets: [GenderBreakdownBucket] @cacheControl(maxAge: 600)
    }
    
    type SalaryRangeBucket @cacheControl(maxAge: 600) {
        id: String
        count: Int
        percentage: Float
    }
    
    type YearSalaryRange @cacheControl(maxAge: 600) {
        year: Int
        """
        Total number of respondents who have answered this specific question.
        """
        total: Int
        completion: Float
        buckets: [SalaryRangeBucket] @cacheControl(maxAge: 600)
    }
    
    type CompanySizeBucket @cacheControl(maxAge: 600) {
        id: String
        count: Int
        percentage: Float
    }
    
    type YearCompanySize @cacheControl(maxAge: 600) {
        year: Int
        """
        Total number of respondents who have answered this specific question.
        """
        total: Int
        completion: Float
        buckets: [CompanySizeBucket] @cacheControl(maxAge: 600)
    }
    
    type YearsOfExperienceBucket @cacheControl(maxAge: 600) {
        id: String
        count: Int
        percentage: Float
    }
    
    type YearYearsOfExperience @cacheControl(maxAge: 600) {
        year: Int
        """
        Total number of respondents who have answered this specific question.
        """
        total: Int
        completion: Float
        buckets: [YearsOfExperienceBucket] @cacheControl(maxAge: 600)
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
        participation: [YearParticipation] @cacheControl(maxAge: 600)
        gender: [YearGenderBreakdown] @cacheControl(maxAge: 600)
        salary: [YearSalaryRange] @cacheControl(maxAge: 600)
        companySize: [YearCompanySize] @cacheControl(maxAge: 600)
        yearsOfExperience: [YearYearsOfExperience] @cacheControl(maxAge: 600)
    }
    
    type OpinionBucket @cacheControl(maxAge: 600) {
        id: Int
        count: Int
        percentage: Float
    }
    
    type YearOpinion @cacheControl(maxAge: 600) {
        year: Int
        """
        Total number of respondents who have answered this specific question.
        """
        total: Int
        completion: Float
        buckets: [OpinionBucket] @cacheControl(maxAge: 600)
    }
    
    type Opinion @cacheControl(maxAge: 600) {
        id: ID!
        byYear: [YearOpinion] @cacheControl(maxAge: 600)
    }
    
    type Query {
        tool(id: ID!): Tool
        feature(id: ID!, section: String!): Feature
        demographics: Demographics
        opinion(id: ID!): Opinion
        opinions(ids: [ID]!): [Opinion] @cacheControl(maxAge: 600)
    }
`
