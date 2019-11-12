# 基于 webRTC 的点对点通话
主要三点技术:`getUserMedia`, `RTCPeerConnection`, `RTCDataChannel`。

## getUserMedia
具体API查看[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/getUserMedia)。

#### navigator.mediaDevices.getUserMedia
```js
navigator.mediaDevices.getUserMedia({ audio: true, video: true }) 
// 参数表示需要同时获取到音频和视频
.then(stream => {
// 获取到优化后的媒体流
})
.catch(err => {
// 捕获错误
});
```

成功捕获之后，`stream` 主要参数如下:
- **id [String]**: 对当前的 `MediaStream` 进行唯一标识。所以每次刷新浏览器或是重新获取 `MediaStream`，`id` 都会变动。
- **active [boolean]**: 表示当前 `MediaStream` 是否是活跃状态（就是是否可以播放）。
- **onactive**: 当 `active` 为 `true` 时，触发该事件。

#### .getAudioTracks() .getVideoTracks
```js
stream.getAudioTracks(); // ==> 输出音频信息
stream.getVideoTracks(); // ==> 输出视频信息
```

同时，主要参数如下:
- **kind**: 当前获取的媒体流类型(Audio/Video)。
- **label**: 媒体设备名称。
- **muted**: 表示媒体轨道是否静音。

#### constraints 约束对象
同时请求不带任何参数的音频和视频:
```js
{audio: true, video: true}
```

想要使用 `1280x720` 的摄像头分辨率：
```js
{
  audio: true,
  video: {width: 1280, height: 720}
}
```
浏览器会试着满足这个请求参数，但是如果**无法准确满足**此请求中参数要求或者用户选择覆盖了请求中的参数时，有可能返回其它的分辨率。

强制要求获取特定的尺寸时，可以使用关键字 `min`, `max`, 或者  `exact`(就是 `min == max`). 以下参数表示要求获取最低为 `1280x720` 的分辨率:
```js
{
  audio: true,
  video: {
    width: {min: 1280},
    height: {min: 720}
  }
}
```

如果摄像头不支持请求的或者更高的分辨率，返回的 `Promise` 会处于 `rejected` 状态，`NotFoundError` 作为 `rejected` 回调的参数，而且**用户将不会得到要求授权的提示**。

造成不同表现的原因是，相对于简单的请求值和 `ideal` 关键字而言，关键字 `min`, `max`, 和 `exact` 有着内在关联的强制性，请看一个更详细的例子：
```js
{
  audio: true,
  video: {
    width: {min: 1024, ideal: 1280, max: 1920},
    height: {min: 720, ideal: 720, max: 1080}
  }
}
```

浏览器会优先尝试接近理想值( `ideal` )的参数设置。简单的请求值也可以理解为是应用理想的值，因此第一个指定分辨率的请求也可以写成如下：
```js
{
  audio: true,
  video: {
    width: {ideal: 1280},
    height: {ideal: 720}
  }
}
```

同时，并非所有的 `constraints` 参数都是数字。如，在移动设备上，如下配置优先使用前摄(如果有的话):
```js
{
  audio: true,
  video: {facingMode: 'user'}
}
```

强制后摄:
```js
{
  audio: true,
  video: {facingMode: {exact: 'environment'}}
}
```

也可以指定设备 `id`:
```js
// 通过 navigator.mediaDevices.enumerateDevices() 获取支持的设备
{video: {devieceId: myCameraDevieceId}}
```

## RTCPeerConnection
`RTCPeerConnection` 接口代表一个由本地计算机到远端的 `WebRTC` 连接。该接口提供了创建，保持，监控，关闭连接的方法的实现。

#### 概述
RTCPeerConnection 作为创建点对点连接的 API，是我们实现音视频实时通信的关键。在点对点通信的过程中，需要交换一系列信息，通常这一过程叫做 — 信令（`signaling`）。在信令阶段需要完成的任务：

- 为每个连接端创建一个 `RTCPeerConnection`，并添加本地媒体流。
- 获取并交换本地和远程描述：`SDP` 格式的本地媒体元数据。
- 获取并交换网络信息：潜在的连接端点称为 `ICE` 候选者。

#### NAT 穿越技术
为每个连接端创建一个 RTCPeerConnection，并添加本地媒体流:
```js
let PeerConnection = window.RTCPeerConnection || window.mozRTCPerrConnection || window.webkitRTCPeerConnection;

let peer = new PeerConnection(iceServers);
```

`RTCPeerConnection` 也同样接收一个参数 — `iceServers`，参数具体内容如下:
```js
{
  iceServers: [
    {url: 'stun:stun.l.google.com:19302'},
    {
      url: 'turn:***',
      username: ***, // 用户名
      credential: *** //密码
    }
  ]
}
```
参数配置了两个 `url`，分别是 `STUN` 和 `TURN`，这便是 `WebRTC` 实现点对点通信的关键，也是一般 `P2P` 连接都需要解决的问题：`NAT穿越`。

`WebRTC` 的通信至少需要两种服务配合：

- 信令阶段需要双向通信服务辅助信息交换。
- `STUN`、`TURN`辅助实现 `NAT穿越`。

#### 建立点对点连接
**呼叫端**（在这里都是指代浏览器）需要给 **接收端** 发送一条名为 **offer** 的信息。

**接收端** 在接收到请求后，则返回一条 **answer** 信息给 **呼叫端**。

这便是 `SDP` 格式的本地媒体元数据的交换。`SDP` 信息一般长这样：
```
    v=0
    o=- 1837933589686018726 2 IN IP4 127.0.0.1
    s=-
    t=0 0
    a=group:BUNDLE audio video
    a=msid-semantic: WMS yvKeJMUSZzvJlAJHn4unfj6q9DMqmb6CrCOT
    m=audio 9 UDP/TLS/RTP/SAVPF 111 103 104 9 0 8 106 105 13 110 112 113 126
    ...
    ...
```

但是任务不仅仅是交换，还需要分别保存自己和对方的信息:
- **呼叫端** 创建 `offer` 信息后，先调用 `setLocalDescription` 存储本地 `offer` 描述，再将其发送给 **接收端**。
- **接收端** 收到 `offer` 后，先调用 `setRemoteDescription` 存储远端 `offer` 描述；然后又创建 `answer` 信息，同样需要调用 `setLocalDescription` 存储本地 `answer` 描述，再返回给 **呼叫端**
- **呼叫端** 拿到 `answer` 后，再次调用 `setRemoteDescription` 设置远端 `answer` 描述。

到这里点对点连接还缺一步，也就是网络信息 `ICE候选` 交换。不过这一步和 `offer`、`answer` 信息的交换并没有先后顺序，流程也是一样的。即：在**呼叫端**和**接收端**的 `ICE候选` 信息准备完成后，进行交换，并互相保存对方的信息，这样就完成了一次连接。


#### demo 查看顺序
`media API` => `location(NoSserver)` => `net`
