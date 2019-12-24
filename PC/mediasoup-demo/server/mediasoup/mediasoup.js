const mediasoup = require('mediasoup');
const { uuid } = require('uuidv4');

/**
 * 创建 webrtc transport
 * @param {String} ip 目标ip
 */
async function createTransport(ip) {
    const worker = await mediasoup.createWorker();
    
    const mediaCodecs = [
        {
            kind: 'audio',
            mimeType: 'audio/opus',
            clockRate: 48000,
            channels: 2
        },
        {
            kind: 'video',
            mimeType: 'video/H264',
            clockRate: 90000,
            parameters: {
                'packetization-mode': 1,
                'profile-level-id': uuid(),
                'level-asymmetry-allowed': 1
            }
        }
    ];
    
    const router = await worker.createRouter(mediaCodecs);
    console.log(router.rtpCapabilities);
    
    const transport = await router.createWebRtcTransport({
        listenIps: [{ip: ip || '127.0.0.1'}],
        enableUdp: true,
        enableTcp: true,
        preferUdp: true
    });

    return transport;
}

exports.createTransport = createTransport;
