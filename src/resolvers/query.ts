import { SurveyType } from '../types'

export default {
    Query: {
        survey: (parent: any, { survey, year }: { survey: SurveyType; year: number }) => {
            return {
                survey,
                year
            }
        }
    }
}
