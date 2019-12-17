import _ from 'lodash'
import { ratioToPercentage, appendCompletionToYearlyResults } from './common.mjs'

const computeAwareness = (buckets, total) => {
    const neverHeard = buckets.find(bucket => bucket.id === 'never_heard')

    return ratioToPercentage((total - neverHeard.count) / total)
}

const computeInterest = (buckets, total) => {
    const interested = buckets.find(bucket => bucket.id === 'interested')
    const notInterested = buckets.find(bucket => bucket.id === 'not_interested')

    return ratioToPercentage(interested.count / (interested.count + notInterested.count))
}

const computeSatisfaction = (buckets, total) => {
    const wouldUse = buckets.find(bucket => bucket.id === 'would_use')
    const wouldNotUse = buckets.find(bucket => bucket.id === 'would_not_use')

    return ratioToPercentage(wouldUse.count / (wouldUse.count + wouldNotUse.count))
}

export const computeExperienceOverYears = async (db, options, tool, survey) => {
    const collection = db.collection('normalized_responses')

    const path = `tools.${tool}.experience`

    const results = await collection
        .aggregate([
            {
                $match: {
                    survey: survey.survey,
                    // exclude null and empty values
                    [path]: { $nin: [null, ''] }
                }
            },
            {
                $group: {
                    _id: {
                        experience: `$${path}`,
                        year: '$year'
                    },
                    total: { $sum: 1 }
                }
            },
            // reshape documents
            {
                $project: {
                    _id: 0,
                    experience: '$_id.experience',
                    year: '$_id.year',
                    total: 1
                }
            }
        ])
        .toArray()

    // group by years and add counts
    const experienceByYear = _.orderBy(
        results.reduce((acc, result) => {
            let yearBucket = acc.find(b => b.year === result.year)
            if (yearBucket === undefined) {
                yearBucket = {
                    year: result.year,
                    buckets: []
                }
                acc.push(yearBucket)
            }

            yearBucket.buckets.push({
                id: result.experience,
                count: result.total
            })

            return acc
        }, []),
        'year'
    )

    // compute percentages
    experienceByYear.forEach(bucket => {
        bucket.total = _.sumBy(bucket.buckets, 'count')
        bucket.buckets.forEach(subBucket => {
            subBucket.percentage = ratioToPercentage(subBucket.count / bucket.total)
        })
    })

    // compute awareness/interest/satisfaction
    experienceByYear.forEach(bucket => {
        bucket.awarenessInterestSatisfaction = {
            awareness: computeAwareness(bucket.buckets, bucket.total),
            interest: computeInterest(bucket.buckets, bucket.total),
            satisfaction: computeSatisfaction(bucket.buckets, bucket.total)
        }
    })

    return appendCompletionToYearlyResults(db, experienceByYear)
}

const computeToolExperience = async (db, options, tool, year, survey) => {
    const collection = db.collection('normalized_responses')

    const path = `tools.${tool}.experience`

    const results = await collection
        .aggregate([
            {
                $match: {
                    survey: survey.survey,
                    year,
                    // exclude null and empty values
                    [path]: { $nin: [null, ''] }
                }
            },
            {
                $group: {
                    _id: {
                        experience: `$${path}`
                    },
                    count: { $sum: 1 }
                }
            },
            // reshape documents
            {
                $project: {
                    _id: 0,
                    id: '$_id.experience',
                    count: 1
                }
            }
        ])
        .toArray()

    // compute percentages
    const total = _.sumBy(results, 'count')
    results.forEach(bucket => {
        bucket.percentage = ratioToPercentage(bucket.count / total)
    })

    return {
        id: tool,
        total,
        buckets: results
    }
}

export const computeToolsExperience = async (db, options, tools, year, survey) => {
    const results = []
    for (const tool of tools) {
        results.push(await computeToolExperience(db, options, tool, year, survey))
    }

    return results
}

export const computeToolsExperienceRanking = async (db, options, tools, survey) => {
    let availableYears = []
    const metricByYear = {}

    for (const tool of tools) {
        const toolAllYearsExperience = await computeExperienceOverYears(db, options, tool, survey)
        const toolAwarenessInterestSatisfactionOverYears = []

        toolAllYearsExperience.forEach(toolYear => {
            availableYears.push(toolYear.year)

            if (metricByYear[toolYear.year] === undefined) {
                metricByYear[toolYear.year] = {
                    awareness: [],
                    interest: [],
                    satisfaction: []
                }
            }

            ;['awareness', 'interest', 'satisfaction'].forEach(metric => {
                metricByYear[toolYear.year][metric].push({
                    tool,
                    percentage: toolYear.awarenessInterestSatisfaction[metric]
                })
            })

            toolAwarenessInterestSatisfactionOverYears.push({
                year: toolYear.year,
                ...toolYear.awarenessInterestSatisfaction
            })
        })
    }

    for (const yearMetrics of Object.values(metricByYear)) {
        ;['awareness', 'interest', 'satisfaction'].forEach(metric => {
            yearMetrics[metric] = _.sortBy(yearMetrics[metric], 'percentage').reverse()
            yearMetrics[metric].forEach((bucket, index) => {
                bucket.rank = index + 1
            })
        })
    }

    availableYears = _.uniq(availableYears).sort()

    const byTool = []
    tools.forEach(tool => {
        byTool.push({
            id: tool,
            ...['awareness', 'interest', 'satisfaction'].reduce((acc, metric) => {
                return {
                    ...acc,
                    [metric]: availableYears.map(year => {
                        const toolYearMetric = metricByYear[year][metric].find(d => d.tool === tool)
                        let rank = null
                        let percentage = null
                        if (toolYearMetric !== undefined) {
                            rank = toolYearMetric.rank
                            percentage = toolYearMetric.percentage
                        }

                        return { year, rank, percentage }
                    })
                }
            }, {})
        })
    })

    return byTool
}
