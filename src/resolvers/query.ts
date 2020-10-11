import { SurveyType } from '../types'
import { getEntity, getTranslation } from '../helpers'
import { SurveyConfig } from '../types'

export default {
    Query: {
        survey: (parent: any, { survey }: { survey: SurveyType }) => ({
            survey
        }),
        entity: (survey: SurveyConfig, { id }: { id: string }) => ({
            survey,
            ...getEntity({ id })
        }),
        translation: (parent: any, { key, locale }: { key: string; locale: string }) => ({
            ...getTranslation(key, locale)
        })
    }
}
