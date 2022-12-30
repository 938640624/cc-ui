// vue.config.js
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
// const vtkChainWebpack = require('@kitware/vtk.js/Utilities/config/chainWebpack')

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
    // chainWebpack: (config) => {
    //     // vtkChainWebpack(config)
    //     // do not cache worker files
    //     // https://github.com/webpack-contrib/worker-loader/issues/195
    //     config.module.rule('js').exclude.add(/\.worker\.js$/)
    // },
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
                // '@kitware/vtk.js/Rendering/Core/ColorTransferFunction/ColorMaps.json':
                //     '@kitware/vtk.js/Rendering/Core/ColorTransferFunction/LiteColorMaps.json',
            },
        },
        plugins: [
            // new webpack.NormalModuleReplacementPlugin(/^webvr-polyfill$/, (resource) => {
            //     /* eslint-disable-next-line no-param-reassign */
            //     resource.request = '@/src/vtk/webvr-empty.js'
            // }),
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
            new CopyWebpackPlugin([
                {
                    from: path.join(__dirname, 'node_modules', 'itk', 'WebWorkers'),
                    to: path.join(__dirname, 'dist', 'itk', 'WebWorkers'),
                },
                {
                    from: path.join(__dirname, 'node_modules', 'itk', 'ImageIOs'),
                    to: path.join(__dirname, 'dist', 'itk', 'ImageIOs'),
                },
                {
                    from: path.join(__dirname, 'src', 'io', 'itk-dicom', 'web-build', 'dicom*'),
                    to: path.join(__dirname, 'dist', 'itk', 'Pipelines'),
                    flatten: true,
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
