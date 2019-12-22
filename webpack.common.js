const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
    entry: {
        server: path.join(__dirname, 'src/server.ts'),
        standalone: path.join(__dirname, 'src/standalone.ts')
    },
    module: {
        rules: [
            {
                test: /\.yml$/,
                exclude: /node_modules/,
                loader: 'yaml'
            },
            {
                test: /\.graphql$/,
                exclude: /node_modules/,
                loader: 'graphql-tag/loader'
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            }
        ]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.ts', '.js', '.yml', '.graphql']
    },
    externals: [nodeExternals({})],
    target: 'node'
}
