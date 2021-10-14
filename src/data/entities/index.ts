import { Entity } from '../../types'

import browsers from './browsers.yml'
import features from './features.yml'
import languages from './languages.yml'
import libraries from './libraries.yml'
import other from './other.yml'
import podcasts from './podcasts.yml'
import sites from './sites.yml'
import text_editors from './text_editors.yml'
import youtube from './youtube.yml'
import sources from './sources.yml'
import people from './people.yml'
import courses from './courses.yml'
import newsletters from './newsletters.yml'
import socialmedia from './socialmedia.yml'
import industry_sectors from './industry_sectors.yml'
import state_of_css from './state_of_css.yml'
import state_of_js from './state_of_js.yml'

const entities: any = {
    browsers,
    features,
    languages,
    libraries,
    other,
    podcasts,
    sites,
    text_editors,
    youtube,
    sources,
    people,
    courses,
    newsletters,
    socialmedia,
    industry_sectors,
    state_of_css,
    state_of_js
}

// add key as category and flatten the whole thing
const allEntities: Entity[] = Object.keys(entities)
    .map((category: string) => {
        const catEntities = entities[category]
        return catEntities.map((e: Entity) => {
            // add category as a tag
            const tags = e.tags ? [...e.tags, category] : [category]
            return { ...e, category, tags }
        })
    })
    .flat()

export default allEntities
