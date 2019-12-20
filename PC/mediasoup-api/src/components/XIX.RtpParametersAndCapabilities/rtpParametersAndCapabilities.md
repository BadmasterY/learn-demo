## RTP Parameters and Capabilities
`RTP parameters` 描述了 `producer` 端点发送给 `mediasoup` 的媒体（`RTP` 发送参数）或 `mediasoup` 转发给 `consumer` 端点的媒体（`RTP` 接收参数）。

相反，`RTP capabilities` 定义了 `mediasoup` 或 `producer` 端点可以接收的内容，因此 `RTP capabilities` 依赖于（或被约束到）远程 `RTP capabilities`。

### 1. RTP 协商概述
创建 `Mediasoup` 的 `router` 之后，它将提供一组 `RtpCodecCapabilities`，这些 `RtpCodecCapabilities` 定义了该 `router` 中启用的音频和视频编解码器。然后，应用程序检索计算出的 `router.rtpCapabilities`（其中包括通过重传和 `RTCP capabilities` 增强的 `router` 编解码器，以及 `mediashoup` 支持的 `RTP` 头扩展列表），并为端点提供这些 `RTP capabilities`。

希望将媒体发送到 `mediashoup` 的端点使用 `router` 的 `RTP capabilities` 及其自身的功能来计算其发送 `RTP parameters` 并将其发送到 `router`（假设它已经创建了发送媒体的 `transport`）。然后，应用程序使用 `transport.produce()` `API` 在 `router` 中创建一个 `producer` 实例。

当终结点希望从 `router` 与特定 `producer` 接收关联的媒体时（假设它已经创建了用于接收媒体的 `transport`）时，应用程序获取终结点的 `RTP capabilities`，并使用 `transport.consume()` `API` 指示这些功能和要使用的 `producerId`，从而生成一个 `consumer` 实例，其 `RTP` 接收参数是通过合并 `producer` 的 `RTP parameters` 和端点的 `RTP capabilities` 来计算的。然后，应用程序可以将生成的 `consumer.rtpParameters`（以及其他信息）向端点发送。

`Mediasoup` 在从端点接收的信息中是灵活的，这意味着 `producer` 的 `RTP parameters` 可以具有不同的编解码器的 `payloadType` 值和 `RTP` 报头扩展 `ID` 值，这些值与路由器 `RTP capabilities` 中的首选项不同。但是，`producer` 的 `RTP paramaters` 不能包含 `router` 中不存在的编解码器。

`mediashoup` 在发送给端点的内容上是严格的，这意味着端点的 `RTP capabilities` 中的编解码器 `preferredPayloadType` 值和 `RTP` 头扩展 `preferredId` 值必须与 `router` 的 `RTP capabilities` 中的值匹配。然后，`mediashoup` 将基于正在使用的 `producer` 的 `RTP parameters` 和端点的 `RTP capabilities` 构建 `RTP` 接收参数。

最后，规则很简单：
- 发送 `RTP` 的实体（`mediasoup` 或终端）决定发送 `ID`。
- 接收 `RTP` 的实体（`mediasoup` 或终端）必须接受这些 `ID`。

### 2. 辞典
#### 1). RtpParameters
`RTP` 参数有两种类型(`RtpSendParameters` 和 `RtpReceiveParameters`)，它们共享以下定义:

Field | Type | Description | Required | Default
--|--|--|--|--
mid | String | 在 [bundle](https://tools.ietf.org/html/draft-ietf-mmusic-sdp-bundle-negotiation) 规范中定义的 `MID RTP` 扩展值。 | No | - 
codecs | Array<RtpCodecParameters> | 正在使用的媒体和 `RTX` 编解码器。 | Yes | -
headerExtensions | Array<RtpHeaderExtensionParameters> | 使用中的 `RTP` 标头扩展。 | No | []
encodings | Array<RtpEncodingParameters> | 传输的 `RTP` 流及其设置。 | Yes | -
rtcp | RtcpParameters | 用于 `RTCP` 的参数。 | No | -

#### 2). RtpSendParameters
> @ inherits RtpParameters

`RtpSendParameters` 描述了 `mediasoup` 通过其相应的 `mediasoup producer` 从端点接收到的媒体流。

- 这些参数可以包括一个 `mid` 值，`mediasoup transport` 将使用该值来基于接收到的 `RTP` 数据包的 `MID RTP` 扩展值来匹配它们。
- `mediasoup` 允许 `RTP` 使用单一编码和多种编码(`simulcast`)发送参数。在后一种情况下，`encodings` 数组中的每一项都必须包含一个 `ssrc` 或多个 `rid` 字段(`RID RTP` 扩展值)。

**注**: 查看 `simulcast` 和 `svc` 部分以获取更多信息。

#### 3). RtpReceiveParameters
> @ inherits RtpParameters

`RtpReceiveParameters` 描述了 `mediasoup` 通过其相应的 `meidasoup consumer` 发送给端点的媒体流。
- `mid` 值未设置（`mediasoup` 不将 `mid RTP` 扩展包含在发送到端点的 `RTP` 数据包中）。
- `encodings` 数组中只有一个条目（即使相应的 `producer` 使用 `simulcast`）。`consumer` 向端点发送一个连续的 `RTP` 流，并且可以通过 `consumer.setPreferredLayers()` 选择空间/时间层。
- 作为一个例外，在通过 `PipeTransport` 使用流时，`previous bullet` 不是真的，在 `PipeTransport` 中，来自关联 `producer` 的所有 `RTP` 流都通过使用者逐字转发。
- `RtpReceiveParameters` 将始终为其所有编码随机生成其 `ssrc` 值（如果端点支持 `rtx`，则为可选 `rtx:{ssrc:XXXX}`），而不考虑关联 `producer` 中的原始`RtpSendParameters`。即使 `producer` 的编码已经设置了 `rid`，这也适用。

#### 4). RtpCapabilities
`RtpCapabilities` 定义了媒体层或端点可以再媒体级别接收的内容。

Field | Type | Description | Required | Default
--|--|--|--|--
codecs | Array<RtpCodecCapabilities> | 支持的媒体和 `RTX` 编解码器。 | Yes | -
headerExtensions | Array<RtpHeaderExtension> | 支持的 `RTP` 标头扩展。 | No | []

#### 5). RtpCodecParameters
提供有关 `Rtp` 参数内编解码器设置的信息。`mediasoup` 支持的媒体编解码器列表及其设置在 `supportedRtpCapabilities.ts` 文件中定义。

Field | Type | Description | Required | Default
--|--|--|--|--
mimeType | String | 编解码器 `MIME` 媒体类型/子类型(例如 "`audio/opus`", "`video/VP8`")。 | Yes | -
payloadType | Number | 在 `RTP payloadType` 字段中的值。必须是唯一的。 | Yes | -
clockRate | Number | 编解码器时钟速率，以 `hz` 表示。 | Yes | -
channels | Number | 支持的声道数量(例如，立体声是两个)。仅用于音频。 | No | -
parameters | Object | 编解码器特定的参数可用于信令。一些参数（例如 `H264` 中的 `packetization-mode` 和 `profile-level-id` 或 `VP9` 中的 `profile-id`）对于编解码器匹配至关重要。 | No | -
rtcpFeedback | Array<RtcpFeedback> | 此编解码器的 `transport` 和编解码器特定的反馈信息。 | No | []

**注**: 有关编解码器的更多信息，请参见下面的 `CodecParameters` 部分。

#### 6). RtcpFeedback
提供有关特定编解码器的 ` RTCP` 反馈消息的信息。这些消息可以是传输层反馈消息或特定于编解码器的反馈消息。`mediasoup` 支持的 `RTCP` 反馈列表是在 `supportedRtpCapabilities.ts` 文件中定义。

Field | Type | Description | Required | Default
--|--|--|--|--
type | String | `RTCP` 反馈类型。 | Yes | -
parameter | String | `RTCP` 反馈参数。 | No | -

#### 7). RtpEncodingParameters
提供与编码有关的信息，该信息表示媒体 `RTP` 流及其关联的 `RTX` 流(如果有的话)。

Field | Type | Description | Required | Default
--|--|--|--|--
ssrc | Number | 媒体 `SSRC`。 | No | -
rid | String | `RTP RID` 扩展值，必须是唯一的。 | No | -
rtx | Object | `RTX` 流信息。它必须包含一个 `ssrc` 指示 `RTX SSRC` 的数字字段。 | No | -
dtx | Boolean | 它指示是否将使用不连续的 RTP 传输。对于音频（如果编解码器支持）和视频屏幕共享（在传输静态内容时，此选项将禁用 `mediasoup` 中的 `RTP` 不活动监测）很有用。 | No | false
scalabilityMode | String | `RTP` 流（例如 `L1T3`）中的空间和时间层数。参见 [webrtc-svc](https://w3c.github.io/webrtc-svc/)。 | No | -

**注**: 查看 `simulcast` 和 `svc` 部分以获取更多信息。

#### 8). RtpHeaderExtensionParameters
在 `RTP` 参数中定义 `RtpHeaderExtension`。`mediasoup` 支持的 `RTP` 标头扩展列表在 `supportedRtpCapabilities.ts` 文件中定义。

Field | Type | Description | Required | Default
--|--|--|--|--
uri | String | `RTP` 标头扩展的 `URI`，如 [RFC 5285](https://tools.ietf.org/html/rfc5285) 中所定义。 | Yes | -
id | Number | `RTP` 数据包中的数字标识符。必须是唯一的。 | Yes | -
encrypt | Boolean | 如果为 `true`，则标头中的值根据 [RFC 6904](https://tools.ietf.org/html/rfc6904) 进行加密。 | No | false
parameters | Object | 标头扩展的配置参数。 | No | -

- `mediasoup` 当前不支持加密的 `RTP` 标头扩展。
- 目前不考虑任何 `parameters`。

#### 9). RtcpParameters
在 `RTP` 参数中提供有关 `RTCP` 设置的信息。

Field | Type | Description | Required | Default
--|--|--|--|--
cname | String | `RTCP` 使用的规范名称（CNAME）（例如，在 `SDES` 消息中）。 | No | -
reduceSize | Boolean | 是否配置了缩减大小的 `RTCP` [RFC 5506](https://tools.ietf.org/html/5506)（如果是 `true`）还是按照 [RFC 3550](https://tools.ietf.org/html/3550) 中指定的复合 `RTCP`（如果是 `false`）
