const Koa = require('koa');
const cors = require('koa2-cors');
const koaBody = require('koa-body');
const { createTransport } = require('./mediasoup/mediasoup');
const routers = require('./router/router');

const app = new Koa();

app.use(cors({ origin: true }));
app.use(koaBody());
app.use(routers.routers);

const server = require('http').Server(app.callback());
const io = require('socket.io')(server, { transports: ['websocket'] });
const port = 3333;

server.listen(process.env.PORT || port, () => {
    console.log(`server run at: http://127.0.0.1:${port}`);
});

io.of('/socket').on('connection', socket => {
    console.log(`连接成功！可以使用 socket.io 功能了...`);
});

const transport = createTransport();
