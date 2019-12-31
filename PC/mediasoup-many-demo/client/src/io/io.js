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
 * 去电发现对方已在通话中回退触发
 */
socket.on('join', data => {
    console.log(`[socket] ${data.otherUser.username} 已在房间内，正在进入房间...`);
    store.commit('setOtherUser', data.users);
    store.commit('setRoomUsers', data.users);

    socket.emit('join', data);
})

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
    data.self.userid === store.state.user.userid ? store.commit('setRoomUsers', [data.otherUser.userid]) : store.commit('setRoomUsers', [data.self.userid])
});

socket.on('roomUserChange', ({ users }) => {
    console.log(users);
    const len = users.length;
    let temp = [];

    for (let i = 0; i < len; i++) {
        if (users[i] !== store.state.user.userid) temp.push(users[i]);
    }

    store.commit('setRoomUsers', temp);
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
                    socket.emit('createConsumerTransport', { userid: store.state.user.userid, roomUsers: store.state.roomUsers });
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

    const selfMediaStream = new MediaStream([videoTrack, audioTrack]);

    store.state.selfVideo.srcObject = selfMediaStream;

    store.commit('setProducer', { videoProducer, audioProducer });
    store.commit('setStream', { videoTrack, audioTrack });
});

/**
 * 新的远端通讯客户端创建完毕触发
 */
socket.on('newProducer', ({ userid }) => {
    console.log(`[otherProducerConnected] id: ${userid}`);
    store.commit('setOtherUser', userid);

    // otherUser change
    // 正在通话
    // 有新的用户进入
    if(store.state.isCalled) {
        socket.emit('createConsumerTransport', { userid: store.state.user.userid, roomUsers: store.state.roomUsers });
    }
});

/**
 * 创建本地 consumer
 */
socket.on('createdConsumer', async data => {
    // 使用定时器触发
    // 可以使用事件触发，规避定时器
    let timer = setInterval(() => {
        // 使用 otherUsers 判断
        // 确保其他用户已完成 producer 创建
        if (!store.state.otherUser) return;

        clearInterval(timer);

        // 清理
        store.commit('setOtherUser', null);

        let promiseArr = [];

        // 使用room users
        let otherUser = store.state.roomUsers;

        // if (dataType(store.state.otherUser) !== 'Array') {
        //     otherUser = [otherUser];
        // }

        for (let i = 0; i < otherUser.length; i++) {
            if(store.state.recvTransport && store.state.recvTransport[otherUser[i]]) continue;

            const recvTransport = device.createRecvTransport(data[otherUser[i]]);

            // 初次与服务器连接时触发
            recvTransport.on('connect', ({ dtlsParameters }, callback, errback) => {
                new Promise(resolve => {
                    socket.emit('connectConsumerTransport', {
                        userid: store.state.user.userid,
                        otherUserid: otherUser[i],
                        transportId: recvTransport.id,
                        dtlsParameters
                    }, resolve);
                })
                    .then(() => {
                        callback();
                        console.log(`[recvTransport ${otherUser[i]}] connecte is ok!`);
                    })
                    .catch(errback);
                console.log(`[recvTransport ${otherUser[i]}] is connect...`);
            });

            // 连接状态改变时触发
            recvTransport.on('connectionstatechange', (state) => {
                switch (state) {
                    case 'connecting':
                        console.log(`[recvTransport ${otherUser[i]}] is connecting...`);
                        break;
                    case 'connected':
                        console.log(`[recvTransport ${otherUser[i]}] is connected...`);
                        break;
                    case 'failed':
                        console.log(`[recvTransport ${otherUser[i]}] is failed...`);
                        break;
                    default: break;
                }
            });

            const recvTransports = store.state.recvTransport;
            store.commit('setRecvTransport', { [otherUser[i]]: recvTransport, ...recvTransports });
            const promise = new Promise(resolve => {
                socket.emit('consume', {
                    userid: store.state.user.userid,
                    otherUserid: otherUser[i],
                    rtpCapabilities: device.rtpCapabilities
                }, resolve);
            });

            promiseArr.push(promise);
        }

        Promise.all(promiseArr).then(async result => {

            for (let i = 0; i < result.length; i++) {
                await getConsume(result[i]);
            }
        }).catch(err => console.error(err));
    }, 1000);
});

/**
* 获取远端 consumer 信息
*/
async function getConsume(data) {
    const { userid, otherUserid, video, audio } = data;

    const transport = store.state.recvTransport[otherUserid];
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

    const consumers = store.state.consumer;
    store.commit('setConsumer', {
        [otherUserid]: {
            videoConsumer,
            audioConsumer
        },
        ...consumers
    });

    // 合成媒体流
    const stream = new MediaStream([videoConsumer.track, audioConsumer.track]);

    new Promise(resolve => {
        // 取消暂停
        socket.emit('resume', { userid, otherUserid}, resolve);
    }).then(() => {
        store.commit('setCalled', true);
        // 设置媒体流信息
        store.state.video[otherUserid].video.srcObject = stream;
    });
}

/**
 * 所有其他用户操作
 * 可以合成一个方法
 */
socket.on('pauseOtherVideo', data => {
    new Promise(resolve => {
        socket.emit(
            "pausedVideo",
            {
                userid: store.state.user.userid,
                otherUserid: data.userid
            },
            resolve
        );
    })
        .then(() => {
            console.log("暂停视频...");
        })
        .catch(err => {
            console.error(err);
        });
});

socket.on('pauseOtherAudio', data => {
    new Promise(resolve => {
        socket.emit(
            "pausedAudio",
            {
                userid: store.state.user.userid,
                otherUserid: data.userid
            },
            resolve
        );
    })
        .then(() => {
            console.log("暂停音频...");
        })
        .catch(err => {
            console.error(err);
        });
});

socket.on('resumeOtherVideo', data => {
    new Promise(resolve => {
        socket.emit(
            "resumeVideo",
            {
                userid: store.state.user.userid,
                otherUserid: data.userid
            },
            resolve
        );
    })
        .then(() => {
            console.log("恢复视频...");
        })
        .catch(err => {
            console.error(err);
        });
});

socket.on('resumeOtherAudio', data => {
    new Promise(resolve => {
        socket.emit(
            "resumeAudio",
            {
                userid: store.state.user.userid,
                otherUserid: data.userid
            },
            resolve
        );
    })
        .then(() => {
            console.log("恢复音频...");
        })
        .catch(err => {
            console.error(err);
        });
});

export default socket;