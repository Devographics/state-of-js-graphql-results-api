import { useCache } from '../caching'
import { computeToolsMatrix } from '../compute'
import { SurveyConfig, RequestContext } from '../types'

interface MatrixConfig {
    survey: SurveyConfig
    ids: string[]
    type: 'tools' | 'features'
    subType: 'years_of_experience' | 'yearly_salary' | 'company_size'
    experience: string
}

export default {
    Matrices: {
        tools: ({ survey }: { survey: SurveyConfig }, { ids }: { ids: string[] }) => {
            return { survey, ids, type: 'tools' }
        }
        // @todo: implement features matrices
        // features: ({ survey }: { survey: SurveyConfig }, { ids }: { ids: string[] }) => {
        //     return { survey, ids, type: 'features' }
        // }
    },
    ToolsMatrices: {
        workExperience: (
            { survey, ids, type }: Omit<MatrixConfig, 'subType' | 'experience'>,
            { experience }: { experience: MatrixConfig['experience'] }
        ): MatrixConfig => {
            return { survey, ids, type, experience, subType: 'years_of_experience' }
        },
        salary: (
            { survey, ids, type }: Omit<MatrixConfig, 'subType' | 'experience'>,
            { experience }: { experience: MatrixConfig['experience'] }
        ): MatrixConfig => {
            return { survey, ids, type, experience, subType: 'yearly_salary' }
        },
        companySize: (
            { survey, ids, type }: Omit<MatrixConfig, 'subType' | 'experience'>,
            { experience }: { experience: MatrixConfig['experience'] }
        ): MatrixConfig => {
            return { survey, ids, type, experience, subType: 'company_size' }
        }
    },
    ToolsMatrix: {
        year: async (matrix: MatrixConfig, { year }: { year: number }, { db }: RequestContext) => {
            const result = await useCache(computeToolsMatrix, db, [
                {
                    survey: matrix.survey,
                    tools: matrix.ids,
                    experience: matrix.experience,
                    subType: matrix.subType,
                    year
                }
            ])

            return {
                year,
                experience: matrix.experience,
                buckets: result
            }
        }
    }
}
