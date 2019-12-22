const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const NodemonPlugin = require('nodemon-webpack-plugin')
const merge = require('webpack-merge')

const common = require('./webpack.common.js')

module.exports = merge.smart(common, {
    devtool: 'inline-source-map',
    mode: 'development',
    plugins: [new CleanWebpackPlugin(), new NodemonPlugin()],
    watch: true
})
