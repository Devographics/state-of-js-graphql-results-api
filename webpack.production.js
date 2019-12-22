const CleanWebpackPlugin = require('clean-webpack-plugin')
const merge = require('webpack-merge')

const common = require('./webpack.common.js')

module.exports = merge(common, {
    devtool: 'source-map',
    mode: 'production',
    plugins: [new CleanWebpackPlugin()]
})
