import { Entity } from './entity'
import { Opinion } from './opinions'

/**
 * The various types of surveys supported by the API
 */
export type SurveyType = 'js' | 'css'

export interface Survey {
    survey: SurveyType
    year: number
    // tool(id: ToolID!): Tool
    // tools(ids: [ToolID]): [Tool] @cacheControl(maxAge: 600)
    // toolsRankings(ids: [ToolID]!): ToolsRankings
    // feature(id: FeatureID!): Feature
    // features(ids: [FeatureID]): [Feature] @cacheControl(maxAge: 600)
    // demographics: Demographics
    opinion: Opinion
    // otherTools(id: OtherToolsID!): OtherTools
    // resources(id: ResourcesID!): Resources
    entity: Entity
    // category(id: CategoryID!): Category
    // matrices: Matrices
}
