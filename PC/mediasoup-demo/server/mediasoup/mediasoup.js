const mediasoup = require('mediasoup');
const { uuid } = require('uuidv4');

/**
 * 创建 webrtc transport
 */
exports.createRouter = async function createRouter() {
    const worker = await mediasoup.createWorker({
        logLevel: 'warn',
        logTags: [
            'info',
            'ice',
            'dtls',
            'rtp',
            'srtp',
            'rtcp',
        ],
        rtcMinPort: 10000,
        rtcMaxPort: 10100,
    });

    worker.on('died', () => {
        console.error('mediasoup worker died, pid: ', worker.pid);
    });

    const mediaCodecs = [
        {
            kind: 'audio',
            mimeType: 'audio/opus',
            clockRate: 48000,
            channels: 2
        },
        {
            kind: 'video',
            mimeType: 'video/VP8',
            clockRate: 90000,
            parameters: {
                'x-google-start-bitrate': 1000
            }
        }
    ];

    const router = await worker.createRouter({ mediaCodecs });
    // console.log(mediaCodecs);

    return router;
}

/**
 * 创建 webrtc transport
 */
exports.createWebRtcTransport = async function (router) {
    const transport = await router.createWebRtcTransport({
        listenIps: [{
            ip: '192.168.1.205', // 使用本地ip
            announcedIp: null,
        }],
        enableUdp: true,
        enableTcp: true,
        preferUdp: true,
        initialAvailableOutgoingBitrate: 1000000
    });

    transport.on('iceselectedtuplechange', iceSelectedTuple => {
        console.log(`[transport: ${transport.id}] iceSelectedTupleChange: `, iceSelectedTuple);
    });

    transport.on('dtlsstatechange', dtlsState => {
        console.log(`[transport: ${transport.id}] dtlsStateChange: ${dtlsState}`);
    });

    return {
        transport,
        res: {
            id: transport.id,
            iceParameters: transport.iceParameters,
            iceCandidates: transport.iceCandidates,
            dtlsParameters: transport.dtlsParameters,
        },
    };
}