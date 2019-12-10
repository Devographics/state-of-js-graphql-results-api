export default {
    survey: (parent, { survey, year }, context, info) => {
        return {
            survey,
            year
        }
    }
}
