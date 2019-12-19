## PlainRtpTransport
> @inherits `Transport`

`Plain RTP transport` 表示通过其传输普通 RTP 和 RTCP 的网络路径。

### 1. 辞典
#### 1). PlainRtpTransportOptions
Field | Type | Description | Required | Default
--|--|--|--|--
listenIp | TransportListenIp/String | 监听的 `IP` 地址。 | Yes | -
rtcpMux | Boolean | 使用 `RTCP-mux` (`RTCP` 与 `RTP` 在同一端口中)。 | No | true
comedia | Boolean | 是否基于接收到的第一个 `RTP/RTCP` 数据包自动监测远程 `ip` 和 `port`。如果启用，则不能调用 `connect()` 方法。如果设置 `multiSource`，则忽略此选项。 | No | false
multiSource | Boolean | 是否允许来自不同远程 `ip` 和 `port` 的 `RTP/RTCP`。如果设置，则 `transport` 将仅对接收媒体有效(`consume()` 不能在其上调用)，并且 `connect()` 不得调用。 | No | false
enableSctp | Boolean | 创建一个 `SCTP` 关联。 | No | false
numSctpStreams | NumSctpStreams | SCTP 流。 | No | -
maxSctpMessageSize | Number | 可以传递到 `DataProducer.send()` 方法的最大数据大小。 | No |262144
appData | Object | 自定义应用程序数据。 | No | {}

- **注意**，当远程端点在这个普通的 `RTP` 传输上生成 `RTP` 时，`comedia` 模式才有意义。否则，如果远程终端点没有向 `mediashoup` 发送任何 `RTP` 包，则无法检测其远程 `RTP` 的 `ip` 和 `port`，因此端点不会从 `mediashoup` 接收任何包。
  - 换句话说，如果远程端点不打算生成 `RTP`，而只是使用它，则不要使用 `comedia` 模式。在这些情况下，不要设置 `comedia` 标志，并使用远程端点的 `ip` 和 `port` 调用 `connect()`。

- 当设置了 `multiSource` 时，生产者终端不会从 `mediashoup` 接收任何 `RTCP` 包。尽可能避免 `multiSource`。在视频的情况下，如果生产者不发送周期性的视频关键帧，消费者将难以渲染视频（如果设置 `multiSource`， `RTCP PLI` 或 `FIR` 将不能交付给生产者）。

### 2. 属性
通用部分查看 `transport` 属性。

#### 1). plainRtpTransport.tuple
`Transport tuple` 如果启用了 `rtcpMux` 设置，该 `tuple` 将同时引用 `RTP` 和 `RTCP`。

- 一旦 `plainRtpTransport` 创建， `transport.tuple` 将包含有关它的 `localIp`，`localPort` 和 `protocol`。
- 有关 `remoteIp` 和 `remotePort` 的信息将被设置:
  - 在调用 `connect()` 方法之后，或者
  - 通过使用 `comedia` 模式时的动态远程地址检测。

> @type TransportTuple, readonly

#### 2). plainRtpTransport.rtcpTuple
`RTCP` 的 `transport tuple`。如果启用了 `rtcpMux` 设置，则其值为 `undefined`。

- 一旦 `plainRtpTransport` 被创建，同时 `rtcpMux` 设置禁用，`transport.rtcpTuple` 将包含有关它的 `localIp`，`localPort` 和 `protocol`。
- 有关 `remoteIp` 和 `remotePort` 的信息将被设置:
  - 在调用 `connect()` 方法之后，或者
  - 通过使用 `comedia` 模式时的动态远程地址检测。

> @type TransportTuple, readonly

#### 3). plainRtpTransport.sctpParameters
本地 `SCTP` 参数。
> @type SctpParameters, readonly

#### 4). plainRtpTransport.sctpState
当前的 `SCTP` 状态。
> @type TransportSctpState, readonly

### 3. 方法
通用部分查看 `transport` 方法。

#### 1). plainRtpTransport.getStats()
返回 `WebRTC` 传输的当前 `RTC` 统计信息。

> @async
> 
> @override
> 
> @returns Array<PlainRtpTransportStat>


#### 2). plainRtpTransport.connect({ip, port, rtcpPort})
提供带有端点参数的 `plainRtpTransport` 。在启用 `comedia` 模式(在这种情况下将动态检测远端地址)或 `meltiSource` 设置模式时，不得调用。

Argument | Type | Description | Required | Default
--|--|--|--|--
ip | String | 远端 `IP` 地址（IPv4 或 IPv6）。 | Yes | -
port | Number | 远程端口。 | Yes | -
rtcpPort | Number | 远程 RTCP 端口(如果未启用 `RTCP-mux`，则必须填写)。 | No | -

> @async
> 
> @overrides

### 4. 事件 Events
通用部分查看 `transport` 事件。

#### plainRtpTransport.on('sctpstatechange', fn(sctpState))
在传输 `SCTP` 状态更改时触发。

Argument | Type | Description
--|--|--
sctpState | TransportSctpState | 新的 SCTP 状态。

### 5. Observer Events
通用部分查看 `transport Observer Events`。

#### plainRtpTransport.observer.on('sctpstatechange', fn(sctpState))
与 `plainRtpTransport.on('sctpstatechange', fn(sctpState))` 事件相同。

### 更新时间: 2019-12-18 15:26:09