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
const io = require('socket.io')(server, {
    serveClient: false,
    transports: ['websocket']
});
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
            const selfRouter = await createRouter();
            const otherRouter = await createRouter();

            const selfRouterRtpCapabilities = selfRouter.rtpCapabilities;
            routerMap.set(data.self.userid, selfRouter);

            const otherRouterCapabilities = otherRouter.rtpCapabilities;
            routerMap.set(data.otherUser.userid, otherRouter);
            // 将得到的 router rtp capabilities 推送到对应的接收端
            socket.emit('getRouterRtpCapabilities', { routerRtpCapabilities: selfRouterRtpCapabilities });
            socketMap.get(data.otherUser.userid).emit('getRouterRtpCapabilities', { routerRtpCapabilities: otherRouterCapabilities });

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
    socket.on('connectProducerTransport', async (data, callback) => {
        const { producerMap } = utilMaps;

        const transport = producerMap.get(data.userid);
        await transport.connect({
            dtlsParameters: data.dtlsParameters
        });

        console.log(`${data.userid} producer connect is ok!`);

        callback();
    });

    /**
     * 有新的 producer 传输到服务器时触发
     */
    socket.on('produce', async (data, callback) => {
        const { producerMap, produceMap } = utilMaps;

        const { userid, kind, rtpParameters } = data;
        const transport = producerMap.get(userid);
        const producer = await transport.produce({ kind, rtpParameters });
        let prod = produceMap.get(userid);
        produceMap.set(userid, { [kind]: producer, ...prod });

        callback({ id: producer.id });

        prod = produceMap.get(userid);

        console.log(`${userid} [${kind}] produce is ok...`);

        if (prod.audio && prod.video) socket.broadcast.emit('newProducer', { userid });
    });

    socket.on('createConsumerTransport', async data => {
        const { routerMap, consumerMap } = utilMaps;

        const router = routerMap.get(data.userid);
        // 获得 webrtcTransport 和 相关参数
        const { transport, res } = await createWebRtcTransport(router);

        consumerMap.set(data.userid, transport);
        // 推回创建本地 consumer
        socket.emit('createdConsumer', res);
    });

    socket.on('connectConsumerTransport', async (data, callback) => {
        const { consumerMap } = utilMaps;
        const transport = consumerMap.get(data.userid);
        await transport.connect({ dtlsParameters: data.dtlsParameters });
        console.log(`${data.userid} consumer connect is ok!`);

        callback();
    });

    socket.on('consume', async data => {
        const { produceMap, consumerMap, routerMap, consumeMap } = utilMaps;

        const { userid, rtpCapabilities } = data;

        const router = routerMap.get(userid);

        const producer = produceMap.get(userid);
        const { audio, video } = producer;

        const transport = consumerMap.get(userid);

        if (!router.canConsume({
            producerId: video.id,
            rtpCapabilities
        }) && !router.canConsume({
            producerId: audio.id,
            rtpCapabilities
        })) {
            console.log(`Can't use this producer!`);
            return;
        }

        const videoConsumer = await transport.consume({
            producerId: video.id,
            rtpCapabilities,
            paused: true,
        });
        const audioConsumer = await transport.consume({
            producerId: audio.id,
            rtpCapabilities,
            paused: true,
        });

        consumeMap.set(userid, {
            videoConsumer,
            audioConsumer
        });

        let res = {
            video: {
                producerId: video.id,
                id: videoConsumer.id,
                kind: videoConsumer.kind,
                rtpParameters: videoConsumer.rtpParameters,
                type: videoConsumer.type,
                producerPaused: videoConsumer.producerPaused
            },
            audio: {
                producerId: audio.id,
                id: audioConsumer.id,
                kind: audioConsumer.kind,
                rtpParameters: audioConsumer.rtpParameters,
                type: audioConsumer.type,
                producerPaused: audioConsumer.producerPaused
            }
        };

        socket.emit('getConsume', res);
    });

    socket.on('resum', async (data, callback) => {
        const { consumeMap } = utilMaps;

        const consume = consumeMap.get(data.userid);
        await consume.videoConsumer.resume();
        await consume.audioConsumer.resume();

        callback();
    })
});
