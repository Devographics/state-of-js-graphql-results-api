// Might be extended depending on the survey we add.
type SurveyType = 'js' | 'css'

// Depends on the survey type, for example `css_frameworks`.
type SectionId = string

// Depends on the survey type, for example `react`.
type ToolId = string

type ToolExperience =
    | 'would_use'
    | 'would_not_use'
    | 'interested'
    | 'not_interested'
    | 'never_heard'

// Other tools mentioned for a given section,
// which have been normalized, for example,
// other CSS frameworks, it comes from the freeform
// field available for each major section of the survey:
// "Other options you use for the current section not mentioned in the list above".
type SectionOtherTools = {
    others: NormalizedValueMultiple
}

// Other tools not specific to the survey type,
// for example browsers, IDE... which can contain
// both predefined choices and an optional freeform answer
// which get normalized.
type OtherTools = {
    choices: string[]
    others?: NormalizedValueMultiple
}

// Depends on the survey type, for example `flexbox`.
type FeatureId = string

type FeatureExperience =
    | 'never_heard'
    | 'heard'
    | 'used'

type ResourceType =
    | 'blogs_news_magazines'
    | 'podcasts'
    | 'sites_courses'

// Depends on the survey type, for example `css_easy_to_learn`.
type OpinionId = string

// Date string in ISO format (ISO 8601).
type DateString = string

// Generic rating.
type Rating = 0 | 1 | 2 | 3 | 4

// Used to rate opinions, for example:
// "CSS is a programming language".
// Goes from strong disagreement to strong agreement.
type AgreementRating = Rating

// Used to rate happiness, for example:
// "How happy are you with the general state of CSS?".
// Goes from very unhappy to very happy.
type HappinessRating = Rating

// Used to represent the normalization of free form
// fields, when a single normalized result is expected,
// used for example for `user_info.source`.
type NormalizedValueUnique = {
    // Raw input
    raw: string
    // String representation of the regexp which led
    // to the normalization.
    pattern: string
    // Normalized value which matched `pattern`.
    normalized: string
}

type NormalizedValueMultiple = {
    // Raw input
    raw: string
    // String representations of the regexps which led
    // to the normalizations.
    patterns: string[]
    // Normalized values which matched `pattern`,
    // match `patterns` order, meaning `normalized[1]`
    // was generated using `patterns[1]`.
    normalized: string[]
}

type WorkExperienceRange =
    | 'range_less_than_1'
    | 'range_1_2'
    | 'range_2_5'
    | 'range_5_10'
    | 'range_10_20'
    | 'range_more_than_20'

type CompanySizeRange =
    | 'range_1'
    | 'range_1_5'
    | 'range_5_10'
    | 'range_10_20'
    | 'range_20_50'
    | 'range_50_100'
    | 'range_100_1000'
    | 'range_more_than_1000'

type SalaryRange =
    | 'range_work_for_free'
    | 'range_0_10'
    | 'range_10_30'
    | 'range_30_50'
    | 'range_50_100'
    | 'range_100_200'
    | 'range_more_than_200'

type Gender =
    | 'male'
    | 'female'
    | 'non_binary'
    | 'prefer_not_to_say'

// Might change depending on the surveys we make.
type JobTitle =
    | 'cto'
    | 'front_end_developer'
    | 'full_stack_developer'
    | 'back_end_developer'
    | 'web_developer'
    | 'web_designer'
    | 'ui_designer'
    | 'ux_designer'

// Proficiency rating for a specific domain,
// from completely inexperienced to expert.
type Proficiency = Rating

type EnvironmentId = string

interface NormalizedResponse {
    // Auto generated ID.
    _id: number
    // Reference `users` collection,
    // only available for survey made in the Vulcan survey system.
    userId?: number
    // Reference non-normalized `responses` collection,
    // only available for survey made in the Vulcan survey system.
    responseId?: number
    survey: SurveyType
    // Year the response belongs too
    year: number
    // Concatenation of `survey` + `year`
    surveySlug: string
    // Creation and update dates, can be used to compute
    // time spent filling out the survey.
    createdAt: DateString
    updatedAt: DateString
    // Date when the response was normalized.
    generatedAt: DateString
    user_info: {
        os: string
        device: string
        browser: string
        version: string
        browser_type: string
        user_agent: string
        platform: string
        // How participants found the survey,
        // it's a freeform field which is normalized.
        source: NormalizedValueUnique
        referrer: string
        job_title: JobTitle
        years_of_experience: WorkExperienceRange
        company_size: CompanySizeRange
        yearly_salary: SalaryRange
        gender: Gender
        skin_tone: number
        country: string
        continent: string
        backend_proficiency: Proficiency
        javascript_proficiency: Proficiency
        css_proficiency: Proficiency
        // Used to identify users, especially useful when
        // we want to cross responses for surveys filled out
        // on a different platform (typically TypeForm),
        // where we don't have a corresponding entry
        // in the `users` collection.
        hash: string
    }
    tools: Record<ToolId, {
        experience: ToolExperience
    }>
    tools_others: Record<
        SectionId | string,
        SectionOtherTools | OtherTools
    >
    features: Record<FeatureId, {
        experience: FeatureExperience
    }>
    // Contains lists of features grouped by
    // specific topics, for example, CSS units.
    // Participants are asked to select the
    // features they used from a predefined list
    // of options.
    features_others: Record<string, {
        choices: string[]
    }>
    // Opinions on a specific topic, expressed as a rating.
    opinions: Record<OpinionId, AgreementRating>
    // Opinions on a specific topic, freeform field, for example:
    // "What do you feel is currently missing from CSS?"
    // value is normalized.
    opinions_others: Record<OpinionId, {
        others: NormalizedValueMultiple
    }>
    // How happy participants are about certain topics,
    // can be both tied to sections or generic.
    happiness: Record<string, HappinessRating>
    // Resources relevant to the survey type such as blogs, courses...
    resources: Record<ResourceType, {
        // Predefined options selection.
        choices: string[]
        // Optional freeform answer, normalized.
        others?: NormalizedValueMultiple
    }>
    // Contain answers related to environments,
    // for example, browsers, form factors...
    // It has both choices and rating based answers.
    environments: Record<EnvironmentId, Rating | {
        choices: string[]
    }>
}