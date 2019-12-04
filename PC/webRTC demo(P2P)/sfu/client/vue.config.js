module.exports = {
  devServer: {
    port: 8080,
    host: '127.0.0.1',
    https: false,
    open: true,
    disableHostCheck: true,
    proxy: {
      '/app': {
        target: 'http://127.0.0.1:3111',
        changeOrigin: true,
        pathRewrite: {
          '^/app': ''
        }
      },
      '/socket': {
        target: 'ws://127.0.0.1:3111',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/soket': ''
        }
      },
    },
  },
};