import io from 'socket.io-client';
import store from '../store/index';
import device from '../mediasoup/mediasoup';
import { createMedia } from '../util/media';

const obj = {}; // 监听本地 producer 是否添加完毕

const socket = io.connect('/socket', {
    autoConnect: false,
    transports: ['websocket'],
});

/**
 * socket 连接
 */
socket.on('connect', () => {
    console.log('[socket] 连接成功！socket 功能已启用...');
    console.log(`[socket] 欢迎 ${store.state.user.username}`);

    socket.emit('online', { id: store.state.user.userid });
});

/**
 * 去电
 */
socket.on('call', data => {
    store.commit('setCaller', data);
    store.commit('setCalling', true);
});

/**
 * 应答
 */
socket.on('reply', data => {
    if (!data.accept) {
        console.log(`[socket] no! ${data.self.username} reject...`);
        return;
    }

    // ok!do somthing
    console.log(`[device] Brower use ${device.handlerName}...`);
});

/**
 * 获取服务器 router capabilities
 */
socket.on('getRouterRtpCapabilities', async data => {
    await device.load(data);
    console.log(`[device] is loaded: ${device.loaded}`);

    socket.emit('createProducerTransport', {
        userid: store.state.user.userid,
        rtpCapabilities: device.rtpCapabilities,
        forceTcp: false,
    });
});

/**
 * 获取服务器 transport rtpCapabilities
 * 创建 sendTransport
 */
socket.on('createdProducer', async data => {
    const sendTransport = device.createSendTransport(data);

    // 初次与服务器连接时触发
    sendTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
        new Promise((resolve) => {
            socket.emit('connectProducerTransport', {
                userid: store.state.user.userid,
                dtlsParameters
            }, resolve);
        }).then(() => {
            callback();
            console.log(`[sendTransport] connect is ok!`);
        }).catch(errback);
        console.log(`[sendTransport] is connect...`);
    });

    // 有新的 producer 时触发
    sendTransport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
        console.log(`[sendTransport] is produce...`);
        new Promise(resolve => {
            socket.emit('produce', {
                userid: store.state.user.userid,
                transportId: sendTransport.id,
                kind,
                rtpParameters,
            }, resolve);
        })
            .then(({ id }) => {
                console.log(`[${kind}] id: ${id}`);
                obj[kind] = kind;
                callback({ id });
                if (obj.video && obj.audio) { // 全部添加完毕再执行
                    socket.emit('createConsumerTransport', { userid: store.state.user.userid });
                }
            })
            .catch(errback);
    });

    // 连接状态改变时触发
    sendTransport.on('connectionstatechange', (state) => {
        switch (state) {
            case 'connecting':
                console.log(`[sendTransport] is connecting...`);
                break;
            case 'connected':
                console.log(`[sendTransport] is connected...`);
                break;
            case 'failed':
                console.log(`[sendTransport] is failed...`);
                break;
            default: break;
        }
    });

    // 获取媒体信息
    const { videoStream, audioStream } = await createMedia();
    const videoTrack = videoStream.getVideoTracks()[0];
    const audioTrack = audioStream.getAudioTracks()[0];
    const videoProducer = await sendTransport.produce({
        track: videoTrack,
        encodings: [
            { maxBitrate: 100000 },
            { maxBitrate: 300000 },
            { maxBitrate: 900000 }
        ],
        codecOptions: {
            videoGoogleStartBitrate: 1000
        }
    });
    const audioProducer = await sendTransport.produce({
        track: audioTrack,
    });

    store.commit('setProducer', { videoProducer, audioProducer });
});

/**
 * 新的远端通讯客户端创建完毕触发
 */
socket.on('newProducer', ({ userid }) => {
    console.log(`[otherProducerConnected] id: ${userid}`);
    store.commit('setOtherUser', userid);
});

/**
 * 创建本地 consumer
 */
socket.on('createdConsumer', async data => {
    const recvTransport = device.createRecvTransport(data);

    // 初次与服务器连接时触发
    recvTransport.on('connect', ({ dtlsParameters }, callback, errback) => {
        new Promise(resolve => {
            socket.emit('connectConsumerTransport', {
                userid: store.state.user.userid,
                transportId: recvTransport.id,
                dtlsParameters
            }, resolve);
        })
            .then(() => {
                callback();
                console.log(`[recvTransport] connecte is ok!`);
            })
            .catch(errback);
        console.log(`[recvTransport] is connect...`);
    });

    // 连接状态改变时触发
    recvTransport.on('connectionstatechange', (state) => {
        switch (state) {
            case 'connecting':
                console.log(`[recvTransport] is connecting...`);
                break;
            case 'connected':
                console.log(`[recvTransport] is connected...`);
                break;
            case 'failed':
                console.log(`[recvTransport] is failed...`);
                break;
            default: break;
        }
    });

    store.commit('setRecvTransport', recvTransport);

    // 使用定时器触发
    // 可以使用事件触发，规避定时器
    let timer = setInterval(() => {
        if(!store.state.otherUser) return;

        clearInterval(timer);

        socket.emit('consume', {
            userid: store.state.user.userid,
            otherUserid: store.state.otherUser,
            rtpCapabilities: device.rtpCapabilities
        });
    }, 1000);
});

/**
 * 获取远端 consumer 信息
 */
socket.on('getConsume', async data => {
    const { userid, video, audio } = data;

    // 使用定时器执行
    // 可以使用事件触发，规避定时器
    let timer = setInterval(async () => {
        if(!store.state.recvTransport) return;

        clearInterval(timer);

        const transport = store.state.recvTransport;
        let codecOptions = {};
    
        const videoConsumer = await transport.consume({
            id: video.id,
            producerId: video.producerId,
            kind: video.kind,
            rtpParameters: video.rtpParameters,
            codecOptions,
        });
    
        const audioConsumer = await transport.consume({
            id: audio.id,
            producerId: audio.producerId,
            kind: audio.kind,
            rtpParameters: audio.rtpParameters,
            codecOptions,
        });
    
        // 合成媒体流
        const stream = new MediaStream([videoConsumer.track, audioConsumer.track]);
    
        new Promise(resolve => {
            // 取消暂停
            socket.emit('resum', { userid }, resolve);
        }).then(() => {
            // 设置媒体流信息
            store.state.video.srcObject = stream;
        });
    }, 1000);
});

export default socket;