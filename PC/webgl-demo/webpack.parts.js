const ExtractTextPlugin = require('extract-text-webpack-plugin')
const PurifyCSSPlugin = require('purifycss-webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UgifyWebpackPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const cssnano = require('cssnano')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

// webpack-dev-server
exports.devServer = ({host, port} = {}) => ({
  devServer: {
    stats: 'errors-only',
    host,
    port,
    open: true,
    overlay: true
  }
})

// load CSS
exports.loadCss = ({include, exclude} = {}) => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        include,
        exclude,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
})

// extract CSS
exports.extractCss = ({include, exclude, use}) => {
  const plugin = new ExtractTextPlugin({
    allChunks: true,
    filename: 'css/[name].[hash:8].css'
  })

  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          include,
          exclude,
          use: plugin.extract({
            use,
            fallback: 'style-loader'
          })
        }
      ]
    },
    plugins: [plugin]
  }
}

// purify CSS
exports.purifyCss = ({paths}) => ({
  plugins: [new PurifyCSSPlugin({paths})]
})

// CSS fixes prefixes
exports.autoprefixer = () => ({
  loader: 'postcss-loader',
  options: {
    plugins: () => [require('autoprefixer')]
  }
})

// minify CSS
exports.minifyCSS = ({options}) => ({
  plugins: [
    new OptimizeCSSAssetsPlugin({
      cssProcessor: cssnano,
      cssProcessorOptions: options,
      canPrint: false
    })
  ]
})

// load images
exports.loadImages = ({include, exclude, options} = {}) => ({
  module: {
    rules: [
      {
        test: /\.(png|jpg)$/,
        include,
        exclude,
        use: {
          loader: 'url-loader',
          options
        }
      }
    ]
  }
})

// load js
exports.loadJavaScript = ({include, exclude} = {}) => ({
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include,
        exclude,
        use: 'babel-loader'
      }
    ]
  }
})

// minify JavaScript，webpack 4 built-in，but you need to reinstall the configuration
exports.minifyJavaScript = () => ({
  optimization: {
    minimizer: [new UgifyWebpackPlugin({
      uglifyOptions: {
        compress: {
          drop_debugger: true,
          drop_console: true
        }
      }
    })]
  }
})

// build clean
exports.clean = path => ({
  plugins: [new CleanWebpackPlugin([path])]
})

// copy models
exports.copyModels = (from, to, options) => ({
  plugins: [new CopyWebpackPlugin([{
    from: from + '/models',
    to: to + '/models' // Be careful to modify the path when packaging
  }], options)]
})
