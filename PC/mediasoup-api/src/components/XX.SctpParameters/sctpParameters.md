## Sctp Parameters
### 1. 辞典
#### 1). SctpParameters
`SCTP` 关联的参数。
Field | Type | Description | Required | Default
--|--|--|--|--
port | Number | 必须始终等于 5000。 | Yes | -
OS | Number | 最初请求的输出 `SCTP` 流的数量。 | Yes | -
MIS | Number | 传入 `SCTP` 流的最大数量。 | Yes |-
maxMessageSize | Number | `SCTP` 消息的最大允许大小。 | Yes | -

#### 2). NumSctpStreams
Field | Type | Description | Required | Default
--|--|--|--|--
OS | Number | 最初请求的输出 `SCTP` 流数（从 1 到 65535）。 | No | 1024
MIS | Number | 传入 `SCTP` 流的最大数量（从 1 到 65535）。 | No | 1024

`OS` 和 `MIS` 都是 `SCTP INIT+ACK` 握手的一部分。`OS` 指的是服务器端传输创建的（即将被 `DataConsumers` 使用的）初始 `SCTP` 流的数量，而 `MIS` 是指服务器端传输可以接收的最大的传入 `SCTP` 流的数量（供 `DataProducers` 使用）。因此，如果服务器端传输仅用于创建 ``（但没有 `DataConsumers`），那么 `OS` 可能较低（~1）。但是，如果在服务器端传输上需要 `DataConsumers`，则 `OS` 必须具有适当的值，而这种适当的值取决于远程终结点是否支持 `SCTP_ADD_STREAMS` 扩展。

- `libwebrtc`（Chrome，Safari等）未启用 `SCTP_ADD_STREAMS`，因此，如果需要 `DataConsumers`，`OS` 应该是 `1024`（`libwebrtc` 启用的数据通道的最大数量）。
- `Firefox` 确实启用了 `SCTP_ADD_STREAMS`，因此，如果需要 `DataConsumers`，`OS` 可以更低（例如 16）。`mediashoup` 的 `transport` 将在需要时分配和公布更多传出的 `SCTM` 流。
- `mediasoup-client` 通过 `device.sctpCapabilities getter` 提供特定的每个浏览器/版本 `OS` 和 `MIS` 值。

#### 3). SctpStreamParameters
`SCTP` 流参数描述了某个 `SCTP` 流的可靠性。
Field | Type | Description | Required | Default
--|--|--|--|--
streamId | Number | `SCTP` 流 `ID`。 | Yes | -
ordered | Boolean | 是否必须按顺序接收数据消息。如果为 `true`，则将可靠地发送消息。 | No | true
maxPacketLifeTime | Number | 如果 `ordered` 为 `false`，则指示将停止重发 `SCTP` 数据包的时间（`ms`）。 | No | -
maxRetransmits | Number | 如果 `ordered` 为 `false`，则表示将重传数据包的最大次数。 | No | -

- 如果 `ordered` 为 `true`，则 `maxPacketLifeTime` 与 `maxRetransmits` 必须为 `false`。
- 如果 `ordered` 为 `false`，则 `maxPacketLifeTime` 与 `maxRetransmits` 只能有一个为 `true`。

### 更新时间: 2019-12-23 11:50:03