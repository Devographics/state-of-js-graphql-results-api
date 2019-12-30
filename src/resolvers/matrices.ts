import { useCache } from '../caching'
import { computeToolsMatrix } from '../compute'
import { SurveyConfig, RequestContext } from '../types'

interface MatrixConfig {
    survey: SurveyConfig
    ids: string[]
    type: 'tools' | 'features'
    experience: string
}

const getMatrixConfig = (
    { survey, ids, type }: Omit<MatrixConfig, 'experience'>,
    { experience }: { experience: MatrixConfig['experience'] }
): MatrixConfig => ({ survey, ids, type, experience })

const generateMatrixResolver = (type: 'years_of_experience' | 'yearly_salary' | 'company_size') => ({
    year: async (matrix: MatrixConfig, { year }: { year: number }, { db }: RequestContext) => {
        const result = await useCache(computeToolsMatrix, db, [
            {
                survey: matrix.survey,
                tools: matrix.ids,
                experience: matrix.experience,
                type,
                year
            }
        ])

        return {
            year,
            experience: matrix.experience,
            buckets: result
        }
    }
})

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
        workExperience: getMatrixConfig,
        salary: getMatrixConfig,
        companySize: getMatrixConfig
    },
    ToolsWorkExperienceMatrix: generateMatrixResolver('years_of_experience'),
    ToolsSalaryMatrix: generateMatrixResolver('yearly_salary'),
    ToolsCompanySizeMatrix: generateMatrixResolver('company_size')
}
