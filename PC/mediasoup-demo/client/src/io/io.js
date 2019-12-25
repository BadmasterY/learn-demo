import io from 'socket.io-client';
import store from '../store/index';
import device from '../mediasoup/mediasoup';
import { createMedia } from '../util/media';

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

    console.log(`device can use video: ${device.canProduce('video')}`);
    console.log(`device can use video: ${device.canProduce('audio')}`);

    socket.emit('createProducerTransport', {
        userid: store.state.user.userid,
        rtpCapabilities: device.rtpCapabilities,
        forceTcp: false,
    });
});

socket.on('createdProducer', async data => {
    const sendTransport = await device.createSendTransport(data);

    sendTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
        console.log(data);
        const promise = new Promise(() => {
            socket.emit('connectProducerTransport', {
                userid: store.state.user.userid,
                transportId: sendTransport.id,
                dtlsParameters
            });
        });
        promise.then(callback).catch(errback);
        console.log(`[sendTransport] is connect...`);
    });

    sendTransport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
        console.log(`[sendTransport] is produce...`)
        try {
            await socket.emit('produce', {
                userid: store.state.user.userid,
                transportId: sendTransport.id,
                kind,
                rtpParameters,
            });
            callback({ id: 'is not true...' });
        } catch (err) {
            errback(err);
        }
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
            videoGoogleStartBitrate: 10000
        }
    });
    const audioProducer = await sendTransport.produce({
        track: audioTrack,
    });

    store.commit('setProducer', { videoProducer, audioProducer });
});

socket.on('newProducer', ({ userid }) => {
    console.log(`new producer from user id: ${userid}`);
    console.log(`self id: ${store.state.user.userid}`);
});

socket.on('connected', data => {
    if(data.userid === store.state.user.userid) {
        console.log('[server] connect is ok!');
    }else {
        console.log('start get stream...');
        socket.emit('createConsumerTransport', { userid: data.userid,forceTcp: false });
    }
});

socket.on('createdConsumer', data => {
    console.log(data);
    // do ssomething...
});

export default socket;