import http from 'http';
import Koa from 'koa';
import KoaBody from 'koa-bodyparser';
import cors from 'koa2-cors';
import config from 'config';

import { Http } from './interfaces/config';
import { routes } from './router';

const httpConfig: Http = config.get('http');

const app = new Koa();

app.use(cors({ origin: 'true' }));
app.use(KoaBody());
app.use(routes);

app.on('error', error => {
    console.log('[koa] app-level error: ', { error });
});

const server = new http.Server(app.callback());

server.listen(httpConfig, () => {
    console.log(`[http] server run at http://${httpConfig.host}:${httpConfig.port}...`);
});
