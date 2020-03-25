const http = require('http');
const httpConfig = require('config').get('http');

const server = new http.Server();
server.listen(httpConfig, () => {
    console.log(`[http] server run at: http://${httpConfig.host}:${httpConfig.port}`);
});