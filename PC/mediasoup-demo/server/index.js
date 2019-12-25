const Koa = require('koa');
const cors = require('koa2-cors');
const koaBody = require('koa-body');
const { createRouter, createWebRtcTransport } = require('./mediasoup/mediasoup');
const routers = require('./router/router');

const { utilMaps } = require('./utils/maps');

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

    /**
     * 上线
     */
    socket.on('online', data => {
        const { socketMap } = utilMaps;

        socketMap.set(data.id, socket);
    });

    /**
     * 呼叫
     */
    socket.on('call', data => {
        const { socketMap } = utilMaps;
        socketMap.get(data.otherUser.userid).emit('call', data);
    });

    /**
     * 响应呼叫
     */
    socket.on('accept', async data => {
        const { socketMap, routerMap } = utilMaps;
        const res = data;

        // 可以使用 room 广播
        socket.emit('reply', res);
        socketMap.get(data.otherUser.userid).emit('reply', res);

        // 接受呼叫
        if (data.accept) {
            const router = await createRouter();
            const routerRtpCapabilities = router.rtpCapabilities;
            routerMap.set(data.self.userid, router);
            // 将得到的 router rtp capabilities 推送到对应的接收端
            socket.emit('getRouterRtpCapabilities', { routerRtpCapabilities });
        }
    });

    /**
     * 创建 producer trnsport
     */
    socket.on('createProducerTransport', async data => {
        const { routerMap, producerMap } = utilMaps;

        const router = routerMap.get(data.userid);
        // 获得 webrtcTransport 和 相关参数
        const { transport, res } = await createWebRtcTransport(router);

        producerMap.set(data.userid, transport);
        // 推回创建本地 producer
        socket.emit('createdProducer', res);
    });

    /**
     * 响应本地即将建立 ice + dtls 连接
     * 需要与服务器交换信息时触发
     */
    socket.on('connectProducerTransport', async data => {
        const { producerMap } = utilMaps;
        
        const transport = producerMap.get(data.userid);
        await transport.connect({
            dtlsParameters: data.dtlsParameters
        });
        console.log(`${data.userid} connect is ok!`);

        // 可以改为 room 广播
        socket.emit('connected', {userid: data.userid});
        socket.broadcast.emit('connected', { userid: data.userid });
    });

    /**
     * 有新的 producer 传输到服务器时触发
     */
    socket.on('produce', async data => {
        const { producerMap } = utilMaps;

        const { userid, kind, rtpParameters } = data;
        const transport = producerMap.get(userid);
        const producer = await transport.produce({ kind, rtpParameters });

        console.log(`${userid} produce is ok...`);
        socket.broadcast.emit('newProducer', { userid });
    });
});
