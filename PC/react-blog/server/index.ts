const http = require('http');
const Koa = require('koa');
const KoaBody = require('koa-body');
const cors = require('koa2-cors');
const httpConfig = require('config').get('http');

const app = new Koa();

app.use(cors({ origin: true }));
app.use(KoaBody());

app.on('error', (error: any) => {
    console.log('[koa] app-level error: ', { error });
});

const server = new http.Server(app.callback());

server.listen(httpConfig, () => {
    console.log(`[http] server run at http://${httpConfig.host}:${httpConfig.port}...`);
});


