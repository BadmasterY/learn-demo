## RTC Statistics
所有 `mediasoup RTC` 类都包含 `getStats()` 具有以下签名的方法：

> @async
> 
> @returns Array<Object>

下面是由 `mediasoup` 中的不同 `RTC` 类生成的统计信息列表。

### 1. WebRtcTransport statistics
```js
const stats = await webRtcTransport.getStats();

// =>
[
  {
    "bytesReceived": 5360091,
    "bytesSent": 20988,
    "dtlsState": "connected",
    "iceRole": "controlled",
    "iceSelectedTuple": {
      "localIp": "11.22.33.44",
      "localPort": 56726,
      "protocol": "udp",
      "remoteIp": "55.66.77.88",
      "remotePort": 52320
    },
    "iceState": "completed",
    "probationBytesSent": 0,
    "probationSendBitrate": 0,
    "recvBitrate": 1802072,
    "rtpBytesReceived": 5104571,
    "rtpBytesSent": 0,
    "rtpRecvBitrate": 1835651,
    "rtpSendBitrate": 0,
    "rtxBytesReceived": 179934,
    "rtxBytesSent": 0,
    "rtxRecvBitrate": 0,
    "rtxSendBitrate": 0,
    "sctpState": "connected",
    "sendBitrate": 4992,
    "timestamp": 18079607138,
    "transportId": "a00746bd-0758-4dfc-9f5f-c0ad4eb326d5",
    "type": "webrtc-transport"
  }
]
```

### 2. PlainRtpTransport statistics
```js
const stats = await plainRtpTransport.getStats();

// =>
[
  {
    "bytesReceived": 467406,
    "bytesSent": 2550,
    "comedia": true,
    "multiSource": false,
    "rtcpMux": true,
    "probationBytesSent": 0,
    "probationSendBitrate": 0,
    "recvBitrate": 1802072,
    "rtpBytesReceived": 5104571,
    "rtpBytesSent": 0,
    "rtpRecvBitrate": 1835651,
    "rtpSendBitrate": 0,
    "rtxBytesReceived": 0,
    "rtxBytesSent": 0,
    "rtxRecvBitrate": 0,
    "rtxSendBitrate": 0,
    "sendBitrate": 24,
    "timestamp": 924308648,
    "transportId": "8e7dc219-5cb0-4cca-b1ca-0bbbc584a364",
    "tuple": 
    {
      "localIp": "11.22.33.44",
      "localPort": 45346,
      "protocol": "udp",
      "remoteIp": "55.66.77.88",
      "remotePort": 56971
    },
    "type": "plain-rtp-transport"
  }
]
```

### 3. PipeTransport statistics
```js
const stats = await pipeTransport.getStats();

// =>
[
  {
    "probationBytesSent": 0,
    "probationSendBitrate": 0,
    "recvBitrate": 1802072,
    "rtpBytesReceived": 5104571,
    "rtpBytesSent": 0,
    "rtpRecvBitrate": 1835651,
    "rtpSendBitrate": 0,
    "rtxBytesReceived": 0,
    "rtxBytesSent": 0,
    "rtxRecvBitrate": 0,
    "rtxSendBitrate": 0,
    "sendBitrate": 24,
    "timestamp": 924308980,
    "transportId": "352f60cd-10ac-443b-8529-6474ecba2e46",
    "tuple": 
    {
      "localIp": "11.22.33.44",
      "localPort": 12455,
      "protocol": "udp",
      "remoteIp": "11.22.33.44",
      "remotePort": 42301
    },
    "type": "pipe-transport"
  }
]
```

### 4. Producer statistics
`producer` 的统计信息包含每个接收到的 `RTP` 流的信息。**请注意**，`producer` 的统计数据显示 `RTP` 流是由 `producer` 端点发送的，因此是 `mediasoup` 接收到的，这是没有任何数据包修改的。

#### 1). Simulcast Producer
如果使用 `simulcast`，则 `producer` 统计信息中的条目将与发现的 `RTP` 流一样多。这些流可以具有 `N` 个时间层。
```js
const stats = await producer.getStats();

// =>
[
  {
    "bitrate": 678400,
    "bitrateByLayer": 
    {
      "0.0": 237992,
      "0.1": 145496,
      "0.2": 294912
    },
    "byteCount": 4265668,
    "firCount": 0,
    "fractionLost": 0,
    "jitter": 0,
    "kind": "video",
    "mimeType": "video/VP8",
    "nackCount": 0,
    "nackPacketCount": 0,
    "packetCount": 4150,
    "packetsDiscarded": 0,
    "packetsLost": 0,
    "packetsRepaired": 0,
    "packetsRetransmitted": 95,
    "pliCount": 5,
    "rid": "r2",
    "roundTripTime": 43.55,
    "rtxSsrc": 2830213299,
    "score": 10,
    "ssrc": 689337360,
    "timestamp": 925298114,
    "type": "inbound-rtp"
  },
  {
    "bitrate": 242784,
    "bitrateByLayer": 
    {
      "0.0": 85608,
      "0.1": 52752,
      "0.2": 104424
    },
    "byteCount": 1677745,
    "firCount": 0,
    "fractionLost": 0,
    "jitter": 0,
    "kind": "video",
    "mimeType": "video/VP8",
    "nackCount": 5,
    "nackPacketCount": 31,
    "packetCount": 2045,
    "packetsDiscarded": 0,
    "packetsLost": 4294967281,
    "packetsRepaired": 15,
    "packetsRetransmitted": 563,
    "pliCount": 3,
    "rid": "r1",
    "roundTripTime": 48.1,
    "rtxSsrc": 2486781276,
    "score": 10,
    "ssrc": 2995277190,
    "timestamp": 925298114,
    "type": "inbound-rtp"
  },
  {
    "bitrate": 86768,
    "bitrateByLayer": 
    {
      "0.0": 29648,
      "0.1": 19344,
      "0.2": 37776
    },
    "byteCount": 581258,
    "firCount": 0,
    "fractionLost": 0,
    "jitter": 2,
    "kind": "video",
    "mimeType": "video/VP8",
    "nackCount": 0,
    "nackPacketCount": 0,
    "packetCount": 1362,
    "packetsDiscarded": 0,
    "packetsLost": 0,
    "packetsRepaired": 0,
    "packetsRetransmitted": 10,
    "pliCount": 1,
    "rid": "r0",
    "roundTripTime": 49.77,
    "rtxSsrc": 2118917939,
    "score": 10,
    "ssrc": 3060700812,
    "timestamp": 925298114,
    "type": "inbound-rtp"
  }
]
```

#### 2). SVC producer
在 `SVC` 中，`producer` 统计信息中将只有一个流，其中包含 `N` 个时间层和空间层。
```js
[
  {
    "bitrate": 680020,
    "bitrateByLayer": {
      "0.0": 38957,
      "0.1": 48842,
      "0.2": 72589,
      "1.0": 135837,
      "1.1": 175149,
      "1.2": 260762,
      "2.0": 323139,
      "2.1": 461565,
      "2.2": 680020
    },
    "byteCount": 337978,
    "firCount": 0,
    "fractionLost": 0,
    "jitter": 4,
    "kind": "video",
    "mimeType": "video/VP9",
    "nackCount": 0,
    "nackPacketCount": 0,
    "packetCount": 347,
    "packetsDiscarded": 0,
    "packetsLost": 0,
    "packetsRepaired": 0,
    "packetsRetransmitted": 149,
    "pliCount": 0,
    "roundTripTime": 34.57,
    "rtxSsrc": 4171189299,
    "score": 10,
    "ssrc": 518176773,
    "timestamp": 1205013977,
    "type": "inbound-rtp"
  }
]
```

### 5. Consumer statistics
`consumer` 的统计信息包括两个条目：`consumer` 中 `RTP` 流的统计信息（`type: "outboundrtp"`）和 `producer` 中关联 `RTP` 流的统计信息（`type: "inboundrtp"`）。

```js
const stats = await consumer.getStats();

// =>
[
  {
    "bitrate": 625312,
    "byteCount": 879947,
    "firCount": 0,
    "fractionLost": 0,
    "kind": "video",
    "mimeType": "video/VP8",
    "nackCount": 0,
    "nackPacketCount": 0,
    "packetCount": 979,
    "packetsDiscarded": 0,
    "packetsLost": 0,
    "packetsRepaired": 0,
    "packetsRetransmitted": 0,
    "pliCount": 0,
    "roundTripTime": 33.02,
    "rtxSsrc": 836324070,
    "score": 10,
    "ssrc": 328066115,
    "timestamp": 925531753,
    "type": "outbound-rtp"
  },
  {
    "bitrate": 627872,
    "bitrateByLayer": 
    {
      "0.0": 238856,
      "0.1": 145872,
      "0.2": 243144
    },
    "byteCount": 883855,
    "firCount": 0,
    "fractionLost": 0,
    "jitter": 2,
    "kind": "video",
    "mimeType": "video/VP8",
    "nackCount": 0,
    "nackPacketCount": 0,
    "packetCount": 979,
    "packetsDiscarded": 0,
    "packetsLost": 0,
    "packetsRepaired": 0,
    "packetsRetransmitted": 167,
    "pliCount": 2,
    "rtxSsrc": 1976184061,
    "score": 10,
    "ssrc": 2440984788,
    "timestamp": 925531753,
    "type": "inbound-rtp"
  }
]
```

但是，在 `PipeTransport` 上创建 `consumer` 时会有一个例外。在这种情况下，`consumer` 将所有 `producer` 的 `RTP` 流转发到其目的地。该 `consumer` 的统计信息包括要转发的每个 `RTP` 流的条目（`type: "outbound-rtp"`），并且不包括 `producer` 中相关的 `RTP` 流的条目（`type: "inbound-rtp"`）。

```js
const stats = await pipeConsumer.getStats();

// =>
[
  {
    "bitrate": 868184,
    "byteCount": 19478693,
    "firCount": 0,
    "fractionLost": 0,
    "kind": "video",
    "mimeType": "video/VP8",
    "nackCount": 0,
    "nackPacketCount": 0,
    "packetCount": 18696,
    "packetsDiscarded": 0,
    "packetsLost": 0,
    "packetsRepaired": 0,
    "packetsRetransmitted": 0,
    "pliCount": 0,
    "roundTripTime": 5.15,
    "score": 10,
    "ssrc": 116684231,
    "timestamp": 514442975,
    "type": "outbound-rtp"
  },
  {
    "bitrate": 350000,
    "byteCount": 8393425,
    "firCount": 0,
    "fractionLost": 0,
    "kind": "video",
    "mimeType": "video/VP8",
    "nackCount": 0,
    "nackPacketCount": 0,
    "packetCount": 9417,
    "packetsDiscarded": 0,
    "packetsLost": 0,
    "packetsRepaired": 0,
    "packetsRetransmitted": 0,
    "pliCount": 0,
    "roundTripTime": 4.43,
    "score": 10,
    "ssrc": 116684230,
    "timestamp": 514442975,
    "type": "outbound-rtp"
  },
  { 
    "bitrate": 153456,
    "byteCount": 3442897,
    "firCount": 0,
    "fractionLost": 0,
    "kind": "video",
    "mimeType": "video/VP8",
    "nackCount": 0,
    "nackPacketCount": 0,
    "packetCount": 5393,
    "packetsDiscarded": 0,
    "packetsLost": 0,
    "packetsRepaired": 0,
    "packetsRetransmitted": 0,
    "pliCount": 0,
    "roundTripTime": 5.6,
    "score": 10,
    "ssrc": 116684229,
    "timestamp": 514442975,
    "type": "outbound-rtp"
  }
]
```

### 6. DataProducer statistics
```js
const stats = await dataProducer.getStats();

// =>
[
  {
    "type": "data-producer",
    "label": "nnawjiwbav",
    "protocol": "app-protocol",
    "messagesReceived": 3496,
    "bytesReceived": 65934
  }
]
```

### 7. DataConsumer statistics
```js
const stats = await dataConsumer.getStats();

// =>
[
  {
    "type": "data-consumer",
    "label": "nnawjiwbav",
    "protocol": "app-protocol",
    "messagesSent": 3496,
    "bytesSent": 65934
  }
]
```

### 更新时间: 2019-12-23 13:09:57