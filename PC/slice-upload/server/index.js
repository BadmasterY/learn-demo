const Koa = require('koa');
const cors = require('koa2-cors');
const body = require('koa-better-body');
const routers = require('./router/index');
const { host, port } = require('config').get('devServer');

const app = new Koa();

app.use(cors({ origin: true }));
app.use(body());
app.use(routers.routers);

app.on('error', (error) => {
    if (error.code === 'EPIPE') {
        console.warn('Koa app-level EPIPE error.', { error });
    } else {
        console.error('Koa app-level error', { error });
    }
})

const server = require('http').Server(app.callback());

server.listen({port, host}, () => {
    console.log(`server run at: http://${host}:${port}`);
});