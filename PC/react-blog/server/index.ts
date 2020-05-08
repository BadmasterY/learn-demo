import http from 'http';
import path from 'path';

import Koa from 'koa';
import KoaBody from 'koa-body';
import cors from 'koa2-cors';
import config from 'config';
import KoaStatic from 'koa-static';
import mount from 'koa-mount';

import { Http, Server } from './interfaces/config';
import { routes } from './router';

const httpConfig: Http = config.get('http');
const serverConfig: Server = config.get('server');

const app = new Koa();

app.use(cors({ origin: 'true' }));
app.use(mount('/', KoaStatic(path.join(__dirname, 'public'))));
app.use(KoaBody({
    multipart: true,
    jsonLimit: serverConfig.jsonLimit, // 控制body的parse转换大小 default 1mb
    formLimit: serverConfig.formLimit  //  控制你post的大小  default 56kb
}));
app.use(routes);

app.on('error', error => {
    console.log('[koa] app-level error: ', { error });
});

const server = new http.Server(app.callback());

server.listen(httpConfig, () => {
    console.log(`[http] server run at http://${httpConfig.host}:${httpConfig.port}...`);
});
