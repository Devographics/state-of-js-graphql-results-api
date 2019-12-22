const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const merge = require('webpack-merge')

const common = require('./webpack.common.js')

module.exports = merge.smart(common, {
    devtool: 'inline-source-map',
    mode: 'development',
    plugins: [new CleanWebpackPlugin()],
    watch: true
})
