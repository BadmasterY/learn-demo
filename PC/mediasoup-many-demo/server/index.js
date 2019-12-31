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
    console.log(socket.handshake.headers)

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
        const { socketMap, routerMap, broadcastMap } = utilMaps;
        if (routerMap.get(data.otherUser.userid)) {
            const users = broadcastMap.get(routerMap.get(data.otherUser.userid));
            socket.emit('join', { users, ...data });
        } else {
            socketMap.get(data.otherUser.userid).emit('call', data);
        }
    });

    /**
     * 响应呼叫
     */
    socket.on('accept', async data => {
        const { socketMap, routerMap, broadcastMap } = utilMaps;
        const res = data;

        // 可以使用 room 广播
        socket.emit('reply', res);
        socketMap.get(data.otherUser.userid).emit('reply', res);

        // 接受呼叫
        if (data.accept) {
            // router 可以理解为房间的概念
            // 但实际上比房间低级
            const router = await createRouter();

            // 获取 router capabilities
            const routerRtpCapabilities = router.rtpCapabilities;
            routerMap.set(data.self.userid, router);
            routerMap.set(data.otherUser.userid, router);

            // 存储映射
            broadcastMap.set(router, [data.self.userid, data.otherUser.userid]);

            // 将得到的 router rtp capabilities 推送到对应的接收端
            socket.emit('getRouterRtpCapabilities', { routerRtpCapabilities });
            socketMap.get(data.otherUser.userid).emit('getRouterRtpCapabilities', { routerRtpCapabilities });

        }
    });

    /**
     * 无论邀请还是手动加入都走这里
     */
    socket.on('join', data => {
        const { routerMap, broadcastMap } = utilMaps;

        const router = routerMap.get(data.otherUser.userid);
        const routerRtpCapabilities = router.rtpCapabilities;
        let users = broadcastMap.get(router);
        users = users.concat(data.self.userid);

        routerMap.set(data.self.userid, router);
        broadcastMap.set(router, users);

        socket.emit('getRouterRtpCapabilities', { routerRtpCapabilities });
        socket.broadcast.emit('roomUserChange', { users });
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

        callback(); // 回调触发 promise
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

        // 同理前端
        // 全部创建之后再执行
        if (prod.audio && prod.video) socket.broadcast.emit('newProducer', { userid });
    });

    /**
     * 创建 consumer transport
     */
    socket.on('createConsumerTransport', async data => {
        const { routerMap, consumerMap } = utilMaps;
        const { userid, roomUsers } = data;
        let response = {};
        const router = routerMap.get(userid);

        for (let i = 0; i < roomUsers.length; i++) {
            if(consumerMap.get(userid) && consumerMap.get(userid)[roomUsers[i]]) continue;

            // 获得 webrtcTransport 和 相关参数
            const { transport, res } = await createWebRtcTransport(router);

            response[roomUsers[i]] = res;
            const consumer = consumerMap.get(userid);
            consumerMap.set(userid, {
                [roomUsers[i]]: transport,
                ...consumer
            });
        }
        // 推回创建本地 consumer
        socket.emit('createdConsumer', response);
    });

    /**
     * 连接 consumer
     */
    socket.on('connectConsumerTransport', async (data, callback) => {
        const { consumerMap } = utilMaps;
        const transport = consumerMap.get(data.userid);
        await transport[data.otherUserid].connect({ dtlsParameters: data.dtlsParameters });
        console.log(`${data.userid} consumer connect is ok!`);

        callback();
    });

    /**
     * 使用远端的 producer 生成本地消费者
     */
    socket.on('consume', async (data, callback) => {
        const { produceMap, consumerMap, routerMap, consumeMap } = utilMaps;

        const { userid, otherUserid, rtpCapabilities } = data;

        const router = routerMap.get(userid);

        const producer = produceMap.get(otherUserid); // 使用远端的 producer
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

        const videoConsumer = await transport[otherUserid].consume({
            producerId: video.id,
            rtpCapabilities,
            paused: true,
        });
        const audioConsumer = await transport[otherUserid].consume({
            producerId: audio.id,
            rtpCapabilities,
            paused: true,
        });

        const consumers = consumeMap.get(userid);
        consumeMap.set(userid,
            {
                [otherUserid]: {
                    videoConsumer,
                    audioConsumer
                },
                ...consumers
            }
        );

        let res = {
            userid,
            otherUserid,
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

        callback(res);
    });

    /**
     * 恢复播放
     */
    socket.on('resume', async (data, callback) => {
        const { consumeMap } = utilMaps;

        const consume = consumeMap.get(data.userid);
        await consume[data.otherUserid].videoConsumer.resume();
        await consume[data.otherUserid].audioConsumer.resume();

        callback();
    });

    /**
     * 暂停播放
     */
    socket.on('paused', async (data, callback) => {
        const { consumeMap } = utilMaps;

        const consume = consumeMap.get(data.userid);
        await consume[data.otherUserid].videoConsumer.pause();
        await consume[data.otherUserid].audioConsumer.pause();

        callback();
    });

    /**
     * 暂停视频
     */
    socket.on('pauseVideo', async (data, callback) => {
        const { consumeMap } = utilMaps;

        const consume = consumeMap.get(data.userid);
        await consume[data.otherUserid].videoConsumer.pause();

        callback();
    });

    /**
     * 暂停音频
     */
    socket.on('pauseAudio', async (data, callback) => {
        const { consumeMap } = utilMaps;

        const consume = consumeMap.get(data.userid);
        await consume[data.otherUserid].audioConsumer.pause();

        callback();
    });

    /**
     * 恢复视频
     */
    socket.on('resumeVideo', async (data, callback) => {
        const { consumeMap } = utilMaps;

        const consume = consumeMap.get(data.userid);
        await consume[data.otherUserid].videoConsumer.resume();

        callback();
    });

    /**
     * 恢复音频
     */
    socket.on('resumeAudio', async (data, callback) => {
        const { consumeMap } = utilMaps;

        const consume = consumeMap.get(data.userid);
        await consume[data.otherUserid].audioConsumer.resume();

        callback();
    });

    socket.on('pauseSelfVideo', data => {
        socket.broadcast.emit('pauseOtherVideo', data);
    });

    socket.on('pauseSelfAudio', data => {
        socket.broadcast.emit('pauseOtherAudio', data);
    });

    socket.on('resumeSelfVideo', data => {
        socket.broadcast.emit('resumeOtherVideo', data);
    });

    socket.on('resumeSelfAudio', data => {
        socket.broadcast.emit('resumeOtherAudio', data);
    });
});
