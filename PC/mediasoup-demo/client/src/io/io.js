import io from 'socket.io-client';
import store from '../store/index';
import device from '../mediasoup/mediasoup';
import { createMedia } from '../util/media';

const obj = {};

const socket = io.connect('/socket', {
    autoConnect: false,
    transports: ['websocket'],
});

socket.on('connect', () => {
    console.log('连接成功！socket 功能已启用...');
    console.log(`欢迎 ${store.state.user.username}`);

    socket.emit('online', { id: store.state.user.userid });
});

socket.on('call', data => {
    console.log(data);
    store.commit('setCaller', data);
    store.commit('setCalling', true);
});

socket.on('reply', data => {
    // console.log(data);
    if (!data.accept) {
        console.log(`no! ${data.self.username} reject...`);
        return;
    }

    // ok!do somthing
    console.log(`Brower use ${device.handlerName}...`);
});

socket.on('getRouterRtpCapabilities', async data => {
    console.log(data);
    await device.load(data);
    console.log(`device is loaded: ${device.loaded}`);

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
                if (obj.video && obj.audio) {
                    socket.emit('createConsumerTransport', { userid: store.state.user.userid });
                }
            })
            .catch(errback);
    });

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

socket.on('newProducer', ({ userid }) => {
    console.log(`[otherProducerConnected] id: ${userid}`);
});

socket.on('createdConsumer', async data => {
    const recvTransport = device.createRecvTransport(data);
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

    socket.emit('consume', {
        userid: store.state.user.userid,
        rtpCapabilities: device.rtpCapabilities
    });

    store.commit('setRecvTransport', recvTransport);
});

socket.on('getConsume', async data => {
    console.log(data);
    const { video, audio } = data;
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

    const stream = new MediaStream([videoConsumer.track, audioConsumer.track]);

    new Promise(resolve => {
        socket.emit('resum', { userid: store.state.user.userid }, resolve);
    }).then(() => {
        store.state.video.srcObject = stream;
    })
});

export default socket;