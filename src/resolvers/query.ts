import { SurveyType } from '../types'
import { getEntities, getEntity } from '../helpers'
import { getLocales, getLocale, getTranslation } from '../i18n'
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
        entities: (
            parent: any,
            { type, tag }: { type: string; tag: string }
        ) => getEntities({ type, tag }),
        translation: (parent: any, { key, localeId }: { key: string; localeId: string }) =>
            getTranslation(key, localeId),
        locale: (parent: any, { localeId, contexts, enableFallbacks }: { localeId: string; contexts: string[], enableFallbacks?: boolean }) =>
            getLocale(localeId, contexts, enableFallbacks),
        locales: (parent: any, { contexts, enableFallbacks }: { contexts: string[], enableFallbacks?: boolean }) => getLocales(contexts, enableFallbacks)
    }
}
