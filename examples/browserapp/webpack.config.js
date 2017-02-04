import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'
import fr from 'find-root'

const root = fr()

const fallback = []
if (process.env.NVM_PATH) {
    fallback.push(path.resolve(process.env.NVM_PATH, '..', 'node_modules'))
}
fallback.push(path.resolve(root, 'node_modules'))

export default {
    // cwd: path.resolve(__dirname, '..'),
    cache: true,
//    debug: true,
    devtool: 'source-map',
    resolve: {
//        fallback
    },
    resolveLoader: {
//        fallback
    },
    output: {
        publicPath: '/',
        path: path.resolve(__dirname, 'build'),
        filename: 'app.js'
    },
    entry: {
        'browser': [
            path.resolve(__dirname, 'src', 'browser.js')
        ]
    },
    module: {
        loaders: [
            {
                test: /\.(?:jsx?|es6)$/,
                include: /(?:src)/,
                exclude: /(?:node_modules|bower_components)/,
                loaders: ['babel-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'example demo',
            template: path.join(__dirname, 'index.ejs')
        })
    ]
}
