const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const path = require('path')
const glob = require('glob')

const parts = require('./webpack.parts')

// Paths
const PATHS = {
  app: path.join(__dirname, 'test'),
  build: path.join(__dirname, 'build_test'),
  common: path.join(__dirname, 'modules')
}

// Common configuration
const commonConfig = merge([
  {
    entry: PATHS.app + '/index.js',
    output: {
      path: PATHS.build,
      chunkFilename: 'js/[name].[chunkhash:8].js',
      filename: 'js/[name].[chunkhash:8].js'
    },
    resolve: {
      alias: {
        common: PATHS.common,
        confPath: PATHS.app
      }
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'WebGL-Three-Framework',
        template: PATHS.common + '/index.html'
      })
    ]
  }
])

// Production configuration
const productionConfig = merge([
  parts.clean(PATHS.build),
  parts.minifyCSS({
    options: {
      discardComments: {
        removeAll: true
      },
      safe: true
    }
  }),
  parts.minifyJavaScript(),
  parts.extractCss({
    use: ['css-loader', parts.autoprefixer()]
  }),
  parts.purifyCss({
    paths: glob.sync(`{${PATHS.app}/**/*.js,${PATHS.common}/*.html}`, {nodir: true})
  }),
  parts.loadImages({
    options: {
      limit: 1000,
      name: 'image/[name].[hash:8].[ext]',
      publicPath: '../'
    }
  }),
  parts.loadJavaScript({include: PATHS.app}),
  {
    optimization: {
      splitChunks: {
        chunks: 'initial'
      }
    }
  },
  parts.testCopy(PATHS.app, PATHS.build)
])

// The development of the configuration
const developmentConfig = merge([
  parts.devServer({
    host: process.env.HOST,
    port: process.env.PORT
  }),
  parts.loadCss(),
  parts.loadImages()
])

// Run/package the configuration
module.exports = mode => {
  if (mode === 'production') {
    return merge(commonConfig, productionConfig, { mode })
  }

  return merge(commonConfig, developmentConfig, { mode })
}
