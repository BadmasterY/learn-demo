module.exports = {
    devServer: {
        port: 8080,
        host: '0.0.0.0',
        https: false,
        open: true,
        disableHostCheck: true,
        proxy: {
            '/app': {
                target: 'http://127.0.0.1:3333',
                changeOrigin: true,
                pathRewrite: {
                    '^/app': ''
                }
            }
        }
    }
}