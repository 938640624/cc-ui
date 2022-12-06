// vue.config.js
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

let cesiumSource = './node_modules/cesium/Source'
let cesiumWorkers = '../Build/Cesium/Workers'

module.exports = {
    // 基本路径
    publicPath: './',
    // 输出文件目录
    outputDir: 'dist',
    // eslint-loader 是否在保存的时候检查
    lintOnSave: false,
    css: {
        // sourceMap: false,
        loaderOptions: {
            scss: {
                prependData: `@import "@/styles/var.scss";`,
            },
        },
    },
    // webpack-dev-server 相关配置
    devServer: {
        open: process.platform === 'darwin',
        host: '0.0.0.0',
        port: 8082,
        https: false,
        hotOnly: false,
    },
    configureWebpack: {
        output: {
            sourcePrefix: ' ',
        },
        amd: {
            toUrlUndefined: true,
        },
        resolve: {
            alias: {
                vue$: 'vue/dist/vue.esm.js',
                '@': path.resolve('src'),
                cesium: path.resolve(__dirname, cesiumSource),
            },
        },
        plugins: [
            new CopyWebpackPlugin([
                {
                    from: path.join(cesiumSource, cesiumWorkers),
                    to: 'Workers',
                },
            ]),
            new CopyWebpackPlugin([
                {
                    from: path.join(cesiumSource, 'Assets'),
                    to: 'Assets',
                },
            ]),
            new CopyWebpackPlugin([
                {
                    from: path.join(cesiumSource, 'Widgets'),
                    to: 'Widgets',
                },
            ]),
            new CopyWebpackPlugin([
                {
                    from: path.join(cesiumSource, 'ThirdParty/Workers'),
                    to: 'ThirdParty/Workers',
                },
            ]),
            new webpack.DefinePlugin({
                CESIUM_BASE_URL: JSON.stringify('./'),
            }),
        ],
        module: {
            //解决Critical dependency: require function is
            // used in a way in which dependencies cannot be statically extracted的问题
            unknownContextCritical: false,
        },
    },
    // chainWebpack: config => {
    //   const oneOfsMap = config.module.rule('scss').oneOfs.store
    //   oneOfsMap.forEach(item => {
    //     item
    //       .use('sass-resources-loader')
    //       .loader('sass-resources-loader')
    //       .options({
    //         // Provide path to the file with resources
    //         // 要公用的scss的路径
    //         resources: '@/styles/index.scss;'
    //       })
    //       .end()
    //   })
    // },
}
