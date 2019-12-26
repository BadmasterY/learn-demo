const userMap = new Map(); // 用户
const roomMap = new Map(); // 房间
const socketMap = new Map(); // socket
const routerMap = new Map(); // mediasoup router
const producerMap = new Map(); // webrtc transport (producer)
const consumerMap = new Map(); // webrtc transport (consumer)
const produceMap = new Map(); // producer
const consumeMap = new Map(); // consumer

exports.utilMaps = {
    userMap,
    roomMap,
    socketMap,
    routerMap,
    producerMap,
    consumerMap,
    produceMap,
    consumeMap,
};