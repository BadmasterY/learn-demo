const userMap = new Map();
const roomMap = new Map(); // 房间
const onlineMap = new Map(); // 在线成员
const socketMap = new Map(); // socket
const peerMap = new Map(); // peer
const streamMap = new Map; // video stream
const sendMap = new Map(); // 转发

exports.utilMaps = {
  userMap,
  roomMap,
  onlineMap,
  socketMap,
  peerMap,
  streamMap,
  sendMap,
}