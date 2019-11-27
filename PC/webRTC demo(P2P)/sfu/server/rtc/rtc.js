const { RTCPeerConnection } = require('wrtc');
const { socketMap, peerMap, streamMap } = require('../util/maps');

exports.initPeer = function initPeer(userid) {
  // 创建实例
  let peer = new RTCPeerConnection({
    iceServers: [
      { url: 'stun:stun.voipstunt.com' },
      { url: 'stun:stun1.l.google.com:19302' },
      {
        urls: 'turn:39.105.208.159:3478',
        username: 'iris',
        credential: '123456',
      },
    ],
  });

  peer.onicecandidate = event => {
    if (event.candidate) {
      socketMap.get(userid).emit('ice', { sdp: event.candidate });
    }
  }

  peer.onaddStream = event => {
    streamMap.set(userid, event.stream);
  };

  peerMap.set(userid, peer);

  return peer;
}

exports.onOffer = function onOffer(userid, offer) {
  let peer = peerMap.get(userid);
  peer.setRemoteDescription(offer).then(() => {
    return _createAnswer(userid);
  });
}

exports.onICE = function onICE(userid, ice) {
  let peer = peerMap.get(userid);
  peer.addIceCandidate(ice);
}

function _createAnswer(userid) {
  let peer = peerMap.get(userid);
  peer.createAnswer().then(answer => {
    peer.setLocalDescription(answer);
    return answer;
  });
}
