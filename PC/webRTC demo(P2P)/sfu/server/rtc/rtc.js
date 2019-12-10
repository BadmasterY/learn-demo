const { RTCPeerConnection, MediaStream } = require('wrtc');
const { utilMaps } = require('../util/maps');
const { RTCVideoSink, RTCVideoSource, RTCAudioSink, RTCAudioSource } = require('wrtc').nonstandard; // wrtc非标准协议
const { socketMap, peerMap, streamMap, sendMap } = utilMaps;

exports.initPeer = function initPeer(userid) {
  const config = {
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302'
      },
      {
        urls: 'stun:global.stun.twilio.com:3478?transport=udp'
      }
    ],
    sdpSemantics: 'unified-plan'
  }
  // 创建实例
  let peer = new RTCPeerConnection(config);
  
  peer.onsignalingstatechange = event => {
    console.log(peer.signalingState);
  }

  peer.onicecandidate = event => {
    if (event.candidate) {
      socketMap.get(userid).emit('ice', { sdp: event.candidate });
    }
  }

  peer.ontrack = stream => {
    if(streamMap.has(userid)) return;
    
    const video = stream.streams[0].getVideoTracks().map((track) => {
      const sink = new RTCVideoSink(track);
      const source = new RTCVideoSource();
      sink.onframe = ({ frame }) => {
        source.onFrame(frame);
      }
      return source.createTrack();
    })
    const audio = stream.streams[0].getAudioTracks().map((track) => {
      const sink = new RTCAudioSink(track);
      const source = new RTCAudioSource();
      sink.ondata = (event) => {
        source.onData(event);
      }
      return source.createTrack();
    })
    
    const outputStream = new MediaStream(video.concat(audio));
    
    for(const user of sendMap.get(userid)) {
      console.log(user.id, userid);
      let userPeer = peerMap.get(user.id);
      userPeer.addTrack(audio[0], outputStream);
      userPeer.addTrack(video[0], outputStream);
    }

    streamMap.set(userid, outputStream);

    console.log(streamMap);
  };

  peerMap.set(userid, peer);
}

exports.onOffer = function onOffer(userid, offer) {
  let peer = peerMap.get(userid);
  return peer.setRemoteDescription(offer);
}

exports.onICE = function onICE(userid, ice) {
  let peer = peerMap.get(userid);
  peer.addIceCandidate(ice);
}

exports.createAnswer = function createAnswer(userid) {
  let peer = peerMap.get(userid);
  return peer.createAnswer().then(answer => {
    peer.setLocalDescription(answer);
    return answer;
  });
}
