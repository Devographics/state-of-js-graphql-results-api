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
import missing_features from './missing_features.yml'
import sources from './sources.yml'


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
  missing_features,
  sources,
}

// add key as category and flatten the whole thing
const allEntities: Entity[] = Object.keys(entities).map((category: string) => {
  const catEntities = entities[category]
  return catEntities.map((e: Entity) => ({...e, category}))
}).flat()

export default allEntities