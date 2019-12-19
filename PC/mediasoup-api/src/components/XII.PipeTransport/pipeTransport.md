## PipeTransport
> @inherits `Transport`

`pipeTransport` 表示通过其传输普通 `RTP` 和 `RTCP` 的网络路径。`pipeTransport` 旨在与位于同一主机或不同主机上的两个 `router` 实例互通。

- 在 `pipeTransport` 上调用 `consumer()` 时，`Producer` 的所有 `RTP` 流都会被逐字传输（与 `WebRtcTransport` 和 `plaintpttransport` 中发生的情况不同，`WebRtcTransport` 和 `plaintpttransport` 中将单个且连续的 `RTP` 流发送到使用终端。）

### 1. 辞典

#### PipeTransportOptions
Field | Type | Description | Required | Default
--|--|--|--|--
listenIp | TransportListenIp/String | 监听的 `IP` 地址。 | Yes | -
enbaleSctp | Boolean | 创建一个 `STCP` 关联。 | No | false
numSctpStreams | NumSctpStreams | `SCTP` 流编号。 | No | -
maxSctpMessageSize | Number | 可以传递到 `DataProducer.send()` 方法的最大数据大小。 | No | 1073741823
appData | Object | 自定义应用程序数据。 | No | {}

### 2. 属性
通用部分查看 `transport` 属性。

#### 1). pipeTransport.tuple
`Transport tuple`，由于 `pipeTransport` 在设计上使用 `RTCP-mux`，因此它同时引用 `RTP` 和 `RTCP`。

- 一旦 `pipeTransport` 被创建， `transport.tuple` 将包含有关它的 `localIp`，`localPort` 和 `protocol` 信息。
- 有关 `remoteIp` 和 `remotePort` 信息将在调用 `connect()` 方法后设置。

> @type TransportTuple, readonly

#### 2). pipeTransport.sctpParameters
本地 `SCTP` 参数。

> @type SctpParameters, readonly

#### 3). pipeTransport.sctpState
当前的 `SCTP` 状态。

> @type TransportSctpState, readonly

### 3. 方法
通用部分查看 `transport` 方法。

#### 1). pipeTransport.getStats()
返回 `pipeTransport` 的当前 `RTC` 统计信息。

> @async
> 
> @override
> 
> @returns Array<PipeTransportStat>

#### 2). pipeTransport.connect({ip, port})
为 `pipeRtpTransport` 提供远程参数。

Argument | Type | Description | Required | Default
--|--|--|--|--
ip | String | 远程 `IP` 地址（`IPv4` 或者 `IPv6`）。 | Yes | -
port | Number | 远程端口号。 | Yes | -

> @async
> 
> @overrides

### 4. 事件 Events
通用部分查看 `transport` 事件。

#### pipeTransport.on('sctpstatechange', fn(sctpState))

在传输 `SCTP` 状态更改时触发。

Argument | Type | Description
--|--|--
sctpState | TransportSctpState | 新的 `SCTP` 状态。

### 5. Observer Events
通用部分查看 `transport` 的 `Observer Events`。

#### pipeTransport.observer.on('sctpstatechange', fn(sctpState))

与 `pipeTransport.on('sctpstatechange', fn(sctpState))` 方法相同。

### 更新时间: 2019-12-19 14:16:57