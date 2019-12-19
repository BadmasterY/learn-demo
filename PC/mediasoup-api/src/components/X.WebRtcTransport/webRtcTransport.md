## WebRtcTransport
> @inherits `Transport`

`WebRtcTransport` 表示 `WebRTC` 端点和 `mediasoup` 通过 `ICE` 和 `DTLS` 协商的网络路径。`WebRtcTransport` 可用于接收媒体、发送媒体或同时接收和发送媒体。`mediasoup` 没有限制。但是，由于其设计， `mediasoup-client` 和 `libmediasoupclient` 需要单独的 `WebRtcTransport` 来发送和接收。

**注**: `mediasoup` 的 `WebRtcTransport` 实现是 [ICE Lite](https://tools.ietf.org/html/rfc5245#section-2.7)，这意味着它不启动 `ICE` 连接，但是期望来自端点的 `ICE` 绑定请求。

### 1. 辞典
#### 1). WevRtcTransportOptions
Field | Type | Description | Required | Default
--|--|--|--|--
listenIps | Array<TransportListenIp/String> | 侦听 IP 地址或按优先顺序排列的地址(首选是第一个)。 | Yes | -
enableUdp | Boolean | 监听UDP。 | No | true
enableTcp | Boolean | 监听TCP。 | No | false
preferUdp | Boolean | 监听UDP。 | No | false
preferTcp | Boolean | 监听TCP。 | No | false
initialAvailableOutgoingBitrate | Number | 初始可用传出比特率(bps)。 | No | 600000
enableSctp | Boolean | 创建一个 SCTP 关联。 |No | false
numSctpStreams | NumSctpStreams | SCTP流。 | No | -
maxSctpMessageSize | Number | 可以传递给 DataProducer.send() 方法的最大数据大小。 | No | 262144
appData | Object | 自定义应用程序数据。 | No | {}

**注**: `initialAvailableOutgoingBitrate` 仅在 `producer` 端点支持 `REMB` 或 `Transport-CC` 时应用。

#### 2). IceParameters
Field | Type | Description | Required | Default
--|--|--|--|--
usernameFragment | String | ICE用户名片段。 | No |-
password | String | ICE密码。 | No | -
iceLite | Boolean | ICE Lite。 | No | -

#### 3). IceCandidate
Field | Type | Description | Required | Default
--|--|--|--|--
foundation | String | 唯一的标识符，允许ICE关联出现在多个对象上的候选对象 transports。 | Yes | -
priority | Number | 候选人的分配优先级。 | Yes | -
ip | String | 候选人的 IP 地址。 | Yes | -
protocol | String | 候选人的协议( `udp` / `tcp` )。 | Yes | -
port | Number | 候选人的端口号。 | Yes | -
type | String | 候选人的类型(总是 `host`) | Yes | -
tcpType | String | TCP 候选项的类型(总是 `passive`) | No | -

#### 4). DtlsParameters
Field | Type | Description | Required | Default
--|--|--|--|--
role | DtlsRole | DTLS 角色。 | No | 'auto'
fingerprints | Array<DtlsFingerprint> | DTLS 指纹。 | Yes | -

#### 5). DtlsFingerprint
哈希函数算法（在 [RFC 4572](https://tools.ietf.org/html/rfc4572#section-8) 第8节中最初指定的 "哈希函数文本名称" 注册表中定义）及其相应的证书指纹值（使用 [RFC 4572](https://tools.ietf.org/html/rfc4572#section-5) 第5节中 `fingerprint` 的语法表示的小写十六进制字符串）。

Field | Type | Description | Required | Default
--|--|--|--|--
algorithm | String | 哈希函数算法。 | Yes | -
value | String | 证书指纹值。 | Yes | -

### 2. 枚举类型 Enums
#### 1). IceState
Value | Description
--|--
'new' | 尚未收到 ICE 绑定请求。
'connected' | 收到有效 ICE 绑定请求，但没有 USE_CANDIDATE属性。允许传出媒体。
'completed' | 收到具有 USE_CANDIDATE 属性的 ICE 绑定请求。现在允许双向使用媒体。
'disconnected' | ICE 是 "`connected`" 或者 "`completed`"，但突然失败了(如果所选的元组具有 "`tcp`" 协议，则可能会发生这种情况)。
'closed' | `transport` 处于关闭状态。

#### 2). DtlsRole
Value | Description
--|--
'auto' | DTLS Role 是根据已解析的 ICE 角色确定的('`controlled`' 橘色充当 DTLS 客户端，'`controlling`' 角色 充当 DTLS 服务器)。由于 `mediasoup` 是 `ICE Lite` 的实现，因此它始终表现为 ICE '`controlled`'。
'client' | DTLS 客户端角色。
'server' | DTLS 服务器角色。

#### 3). DtlsState
Value | Description
--|--
'new' | DTLS 程序尚未启动。
'connecting' | DTLS 连接中。
'connected' | DTLS 已成功连接(SRTP 密钥已被提取)。
'failed' | DTLS 连接失败。
'closed' | DTLS `transport` 已关闭。

### 3. 属性
通用部分查看 `transport` 属性。

#### 1). webRtcTransport.iceRole
本地 `ICE` 角色。由于采用了 `mediasoup ICE Lite` 设计，因此始终可以 '`controlled`'。

> @type String, readonly

#### 2). webRtcTransport.iceParameters
本地 `ICE` 参数。

> @type IceParameters, readonly

#### 3). webRtcTransport.iceCandidates
本地 `ICE` 候选人。

> @type Array<IceCandidate>, readonly

#### 4). webRtcTransport.iceState
当前 `ICE` 状态。

> @type IceState, readonly

#### 5). webRtcTransport.isceSelectedTuple
如果 `ICE` 处于 `connected` 或 `completed` 状态，则选择的传输元组。如果未建立 `ICE`（未找到工作候选对），则 `undefined`。

> @type TransportTuple, readonly

#### 6). webRtcTransport.dtlsParameters
本地 `DTLS` 参数。

> @type DtlsParameters, readonly

#### 7). webRtcTransport.dtlsState
当前的 `DTLS` 状态。

> @type DtlsState, readonly

#### 8). webRtcTransport.dtlsRemoteCert
`PEM` 格式的远程证书。一旦 `DTLS` 状态变为 `connected`，便进行设置。

> @type String, readonly

**注**: 应用程序可能希望通过使用某些证书实用程序（例如 Node [pem](https://www.npmjs.com/package/pem) 模块）来检查远程证书是否出于授权目的。

#### 9). webRtcTransport.sctpParameters
本地 `SCDP` 参数。

> @type SctpParameters, readonly

#### 10). webRtcTransport.sctpState
当前的 `SCDP` 状态。

### 4. 方法
通用部分查看 `transport` 方法。

#### 1). webRtcTransport.getStats()
返回 `webRtcTransport` 的当前 `RTC` 统计信息。

> @asnyc
> 
> @override
> 
> @returns Array<ProducerStat>

**注**: 有关更多详细信息，请查看 `RTC统计信息` 部分。

#### 2). webRtcTransport.connect({dtlsParameters})
为 `webRtcTransport` 提供端点参数。

Argument | Type | Description | Required | Default
--|--|--|--|--
dtlsParameters | DtlsParameters | 远程 DTLS 参数。 | Yes | -

> @async
> 
> @overrides 重写

```js
await webRtcTransport.connect(
  {
    dtlsParameters :
    {
      role         : "server",
      fingerprints :
      [
        {
          algorithm : "sha-256",
          value     : "E5:F5:CA:A7:2D:93:E6:16:AC:21:09:9F:23:51:62:8C:D0:66:E9:0C:22:54:2B:82:0C:DF:E0:C5:2C:7E:CD:53"
        }
      ]
    }
  });
```

#### 3). webRtcTransport.restartIce()
通过生成必须通过信号发送到远程端点的新本地 `ICE` 参数来重新启动 `ICE` 层。

> @async
> 
> @returns IceParameters

```js
const iceParameters = await webRtcTransport.restartIce();

// Send the new ICE parameters to the endpoint.
```

### 5. 事件 Events
通用部分查看 `transport` 事件。

#### 1). webRtcTransport.on('icestatechange', fn(iceState))
当传输 `ICE` 状态更改时触发。

Argument | Type | Description
--|--|--
iceState | IceState | 新的 `ICE` 状态。

```js
webRtcTransport.on("icestatechange", (iceState) =>
{
  console.log("ICE state changed to %s", iceState);
});
```

#### 2). webRtcTransport.on('iceselectedtuplechange', fn(iceSelectedTuple))
在 `ICE` 状态变为 `completed` 之后以及 `ICE selected tuple` 更改时触发。

Argument | Type | Description
--|--|--
iceSelectedTuple | TransportTuple | 新的 `ICE selected tuple`。

#### 3). webRtcTransport.on('dtlsstatechange', fn(dtlsState))
`Transport dtls` 状态改变时触发。

Argument | Type | Description
--|--|--
dtlsState | DtlsState | 新的 `DTLS` 状态。

#### 4). webRtcTransport.on('sctpstatechange', fn(sctpState))
在 `transport SCTP` 状态改变时触发。

Argument | Type } Description
--|--|--
sctpState | TransportSctpState | 新的 `SCTP` 状态。

### 6. Observer Events
通用部分查看 `transport` 的 `Observer Events` 部分。

#### 1). webRtcTransport.observer.on('icestatechange', fn(iceState))
与 `webRtcTransport.on('icestatechange', fn(iceState))` 事件相同。

#### 2). webRtcTransport.observer.on('iceselecetedtuplechange', fn(iceSelectedTuple))
与 `webRtcTransport.on('iceselectedtuplechange', fn(iceSelectedTuple))` 事件相同。

#### 3). webRtcTransport.observer.on('dtlsstatechange', fn(dtlsState))
与 `webRtcTransport.on('dtlsstatechange', fn(dtlsState))` 事件相同。

#### 4). webRtcTransport.observer.on('sctpstatechange', fn(sctpState))
与 `webRtcTransport.on('sctpstatechange', fn(sctpState))` 事件相同。

### 更新时间: 2019-12-18 13:39:07