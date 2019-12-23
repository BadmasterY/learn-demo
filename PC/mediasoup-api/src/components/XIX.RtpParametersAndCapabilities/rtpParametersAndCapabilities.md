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
提供有关 `Rtp` 参数内编解码器设置的信息。`mediasoup` 支持的媒体编解码器列表及其设置在 [supportedRtpCapabilities.ts](https://github.com/versatica/mediasoup/blob/v3/src/supportedRtpCapabilities.ts) 文件中定义。

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
提供有关特定编解码器的 ` RTCP` 反馈消息的信息。这些消息可以是传输层反馈消息或特定于编解码器的反馈消息。`mediasoup` 支持的 `RTCP` 反馈列表是在 [supportedRtpCapabilities.ts](https://github.com/versatica/mediasoup/blob/v3/src/supportedRtpCapabilities.ts) 文件中定义。

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
reduceSize | Boolean | 是否配置了缩减大小的 `RTCP` [RFC 5506](https://tools.ietf.org/html/5506)（如果是 `true`）还是按照 [RFC 3550](https://tools.ietf.org/html/3550) 中指定的复合 `RTCP`（如果是 `false`） | No | true

- 如果在 `producer` 的 `RtpParameters` 中没有给出 `cname`，那么 `mediashoup` 传输将选择一个随机的 `cname`，该 `cname` 将用于发送给所有关联 `consumer` 的 `RTCP SDES` 消息中。
- `mediasoup` 假定 `reducedSize` 永远为 `true`。

#### 10). RtpCodecCapability
提供有关 `RTP` 编解码器功能(`Rtp codec capability`)的信息。`mediasoup` 支持的媒体编解码器列表及其设置的列表在 [supportedRtpCapabilities.ts](https://github.com/versatica/mediasoup/blob/v3/src/supportedRtpCapabilities.ts) 文件中定义。

`RtpCodecCapability` 对于每种受支持的参数组合，都需要一个确切的值，以提供一个确切的 `preferredPayloadType` 值。例如：
- 多个 `H264` 编解码器，每个编解码器都有各自不同的 "`packetization-mode`" 和 "`profile-level-id`" 值。

Field | Type | Description | Required | Default
--|--|--|--|--
kind | MediaKind | 媒体种类（'`audio`' 和 '`video`'）。 | Yes | -
mimeType | String | 编解码器 `MIME` 媒体类型/子类型（如  "`audio/opus`", "`video/VP8`"）。 | Yes | -
preferredPayloadType | Number | 首选的 `RTP` 有效负载类型。 | Yes | -
clockRate | Number | 编解码器时钟速率，以 `hz` 表示。 | Yes | -
channels | Number | 支持的声道数量（如立体声就是两个）。仅用于音频。 | No | 1
parameters | Object | 编解码器特定的参数。一些参数（例如 `H264` 中的 "`packetization-mode`" 和 "`profile-level-id`" 或 `VP9` 中的 "`profile-id`"）对于编解码器匹配至关重要。 | No | -

**注**: 路由选项（`RouterOptions`）的 `mediaCodecs` 数组中的 `RtpCodecCapability` 项不需要 `preferredPayloadType` 字段（如果未设置， `mediasoup` 将随机选择一个）。如果提供，请确保在 96-127 范围内。

#### 11). RtpHeaderExtension
提供与支持的标头扩展(`Header extension`)有关的信息。`mediasoup` 支持的 `RtpHeaderExtension` 列表在 [supportedRtpCapabilities.ts](https://github.com/versatica/mediasoup/blob/v3/src/supportedRtpCapabilities.ts) 文件中定义。

Field | Type | Description | Required | Default
--|--|--|--|--
kind | MediaKind | 媒体种类（`audio` 或 `video`）。如果未设置，则对所有类型均有效。 | No | -
uri | String | `RTP` 标头扩展的 `URI`，如 [RFC 5285](https://tools.ietf.org/html/rfc5285) 中所定义。 | Yes | -
preferredId | Number | `RTP` 数据包中的首选数字标识符。必须是唯一的。 | Yes | -
preferredEncrypt | Boolean | 如果是 `true`，则最好按照 [RFC 6904](https://tools.ietf.org/html/rfc6904) 加密头中的值。 | No | false
direction | String | 如果为 "`sendrecv`"，则 `mediasoup` 支持发送和接收此 `RTP` 扩展。"`sendonly`" 表示 `mediasoup` 可以发送（但不接收）它。"`recvonly`" 表示 `mediasoup` 可以接收（但不发送）它。 | No | -

- `mediasoup` 当前不支持加密的 `RTP` 标头扩展。
- `direction` 字段只出现在 `mediasoup` 的 `RTP` 功能中（通过 `router.rtpCapabilities` 或 `mediasoup.getSupportedRtpCapabilities()` 检索）。如果存在于端点的 `RTP` 功能中，则会忽略它。

### 3. 枚举类型 Enums

#### MediaKind
Value | Description
--|--
'audio' | 音频媒体类型。
'video' | 视频媒体类型。

### 4. 编解码器参数
当 `producer` 将编解码器参数包含到其 `RTP` 发送参数(`RtpSendParameters`)中时，这些参数将逐字传递给与 `producer` 关联的 `consumer` 的 `RTP` 接收参数(`RtpReceiveParameters`)。

其中一些参数是编解码器设置的一部分，用于编解码器匹配。其他一些编解码器参数会影响相应的生产者和消费者的mediashoup操作。

#### 1). 编解码器匹配的参数
这些参数是编解码器设置的一部分，这意味着它们的值确定 `rtpParameters.codecs` 中的条目是否与远程 `rtpCapabilities.codecs` 中的条目匹配。这些参数是特定于编解码器的：

#### H264
`H264` 编解码器匹配规则很复杂，涉及以下参数的检查（有关更多详细信息，请参阅 [RFC 6184](https://tools.ietf.org/html/rfc6184)）:
Argument | Type | Description | Required | Default
--|--|--|--|--
'packetization-mode' | Number | 0表示必须使用单 `NAL` 模式。1表示必须使用非交错模式。 | No | 0
'profile-level-id' | String | 指示默认的子配置文件和流的默认级别。 | Yes | -
'level-asymmetry-allowed' | Number | 指示是否允许级别不对等。 | No | 0

**注**: `mediasoup` 使用 [h264-profile-level-id](https://github.com/ibc/h264-profile-level-id) `JavaScript` 库评估这些参数并执行正确的 `H264` 编解码器匹配。

**注意**: 根据协商的 `H264` 的 "`packetization-mode`" 和 "`profile-level-id`"，`Chrome` 可以使用 `OpenH264` 软件编码器或 `H264` 外部硬件编码器。在后一种情况下，`Chrome` 不会生成 `simulcast`，而是生成一个流。

#### VP9
Argument | Type | Description | Required | Default
--|--|--|--|--
'profile-id' | Number | `VP9` 编码配置文件（[更多信息](https://www.webmproject.org/vp9/profiles/)）。支持的值为 0 和 2。 | No | 0

#### 2). 影响 mediasoup 操作的参数
这些参数通过启用或禁用某些功能来影响 `mediasoup` 的操作。这些参数是特定于编解码器的：

#### OPUS
Argument | Type | Description | Required | Default
--|--|--|--|--
'useinbandfec' | Number | 如果为 1，`mediasoup` 将使用从 `consumer` 端点接收到的 `RTCP` 接收器报告中丢失的最差的数据包部分，并将其用于 `mediasoup` 发送给 `OPUS` 的 `producer` 端点的接收器报告中。这将迫使它在 `OPUS` 数据包中生成更多的带内 `FEC`，以适应最差的接收器。 | No | 0
'usedtx' | Number | 如果为1，则在没有 `RTP` 流量时，`mediasoup` 不会将流视为不活动。通过在`RTP` 的 `send` 参数中的对应编码指示 `dtx: true`，可以实现相同的行为。 | No | 0

### 5. Simulcast
`Simulcast` 包括发送 `N` 个单独的视频 `RTP` 流（因此 `N` 个不同的 `ssrc`），表示同一视频源的 `N` 个不同质量。如果使用 `RTX`，还将有 `N` 个额外的 `RTP RTX` 流，每个媒体 `RTP` 流一个。每个媒体 `RTP` 流还可以包含 `M` 个时间层。

**注意**: 当前，`mediasoup` 支持 `VP8` 和 `H264` 编解码器的同时广播（可选地具有 `M` 个时间层）。

创建 `simulcast producer` 时，提供给 `transport.producer()` 的关联 `rtpParameters` 必须符合以下规则：
- `encodings` 数组中必须有 `N > 1` 个条目(项)。
- 每种编码必须包括一个 `ssrc` 或多个 `rid` 字段（`RID RTP` 扩展值），以帮助 `Mediasoup` 中的 `producer` 识别每个数据包属于哪个 `RTP` 流。
- 每个编码代表一个 "空间层"。`encodings` 中的条目必须从最低分辨率到最高分辨率排序（编码 `[0]` 表示 "空间层0"，编码 `[N-1]` 表示 "空间层N-1"，即 `N` 个同时广播流）。
- 如果流具有 `M` 个时间层，则必须在 `scalabilityMode` 字段中的每个编码中通知这些时间层：
  - 因为每个流都有一个空间层，所以 `S` 必须是 `1`。
  - 如果没有时间层，则可以省略 `scalabilityMode` 字段（默认为 "`S1T1`"，即一个空间层和一个时间层）。

**注**: 关于 `scalabilityMode` 语法，`mediasoup` 对独立的空间层（`simulcast`）使用 `S`，对独立的空间层（`SVC`）使用 `L`。

`Simulcast producer` 将仅获得单个流，并因此获得其 `rtpParameters.encodings` 数组中的单个条目。这样的编码条目具有确定空间层（`producer` 中的同播流的数量）和时间层的数量的 `scalabilityMode` 值。

**注**: 为了明确起见，如果 `producer` 具有3个流（3个 `SSRC`）的 `simulcast`，那么 `mediasoup` 将向 `producer` 转发单个连续流（1个 `SSRC`）。

`producer` 的 `rtpParameters.encodings` 中的编码项包含一个 `scalabilityMode` 字段，该字段的 `S` 值（独立空间层的数量）与 `producer` 中的流的数量相匹配，其 `T` 值（时间层的数量）与 `producer` 中每个流的时间层的数量相匹配。

#### 例子
以下示例仅显示该 `rtpParameters.encodings` 字段，为简单起见，不包含 `RTX` 信息。

#### 使用 SSRC 同时广播三个流
`producer`:
```js
encodings :
[
  { ssrc: 111110 },
  { ssrc: 111111 },
  { ssrc: 111112 }
]
```

`consumer`:
```js
encodings :
[
  { ssrc: 222220, scalabilityMode: 'S3T1' }
]
```

#### 使用 RID 同时广播四个流和三个时间层
`producer`:
```js
encodings :
[
  { rid: 'r0', scalabilityMode: 'S1T3' },
  { rid: 'r1', scalabilityMode: 'S1T3' },
  { rid: 'r2', scalabilityMode: 'S1T3' },
  { rid: 'r3', scalabilityMode: 'S1T3' }
]
```

`consumer`:
```js
encodings :
[
  { ssrc: 222220, scalabilityMode: 'S4T3' }
]
```

### 6. SVC
`SVC` 包括发送具有 `N` 个空间层和 `M` 个时间层的单个 `RTP` 流。如果使用 `RTX`，还将有一个额外的 `RTP RTX` 流。

`mediashoup` 实现了两种类型的 `SVC`，`full SVC` 和 `K-SVC`。主要的区别在于，在 `K-SVC` 中，需要一个 `RTP` 关键帧来上/下切换 `MIATASUP` 转发给 `consumer` 的最大空间层。有关 `WebRTC` 中 `SVC` 的详细信息，请检查 [webrtc-svc](https://w3c.github.io/webrtc-svc) 规范（正在进行中）。

**注**: 目前，`mediashoup` 在 `full SVC` 和 `K-SVC` 模式下都支持 `VP9` 编解码器的 `SVC`。有关现有实现的当前状态的更多信息，请参阅下面的 `SVC技术现状` 部分。

创建 `SVC` 的 `producer` 时，为 `transport.product()` 提供的关联 `rtpParameters` 必须符合以下规则：

- 编码数组中必须只有一个条目。
- 这种编码必须包含一个 `scalabilityMode` 字段。

`SVC` 的 `consumer` 将获得一个流，因此在其 `rtpParameters.encodings` 数组中只有一个条目。这样的编码条目具有一个 `scalabilityMode` 值，该值确定可用的空间层和时间层的数量（与关联 `producer` 中的值相同）。

#### 例子
以下示例仅显示该 `rtpParameters.encodings` 字段，为简单起见，不包含 `RTX` 信息。

#### 具有三个空间层和两个时间的 full SVC
`producer`: 
```js
encodings :
[
  { ssrc: 111110, scalabilityMode: 'L3T2' }
]
```

`consumer`: 
```js
encodings:
[
  { ssrc: 222220, scalabilityMode: 'L3T2' }
]
```

#### 具有四个空间层和五个时间层的 k-SVC
`producer`:
```js
encodings :
[
  { ssrc: 111110, scalabilityMode: 'L4T5_KEY' }
]
```

`consumer`:
```js
encodings :
[
  { ssrc: 222220, scalabilityMode: 'L4T5_KEY' }
]
```

### 7. SVC技术现状
总体来说，`webRTC` 尚未为 `SVC` 正确定义，并且 `webRTC 1.0` 规范未涵盖 `SVC`。

#### Chrome
`mediasoup-client >= 3.1.0` 通过执行**脏操作**在 `Chrome >= M74` 中启用 `VP9 SVC`（不带任何命令行标志）:
- [Commit](https://github.com/versatica/mediasoup-client/commit/7fe828181361e30d2157659b2aa7f516366beb69?ts=2)
- [Twitter中的讨论](https://twitter.com/ibc_tw/status/1136968240415072256)	

**注意**: `Chrome` 在传输网络摄像头视频的时候使用 `VP9 K-SVC`，在进行屏幕共享的时候 使用的是 `full SVC`。这**必须**在 `mediashoup` 的 `producer` 的 `scalabilityMode` 中正确地发出信号（否则将无法工作）：
- 网络摄像机视频（`K-SVC`），具有三个空间层和三个时间层:
```js
scalabilityMode: 'L3T3_KEY'
```
- 具有三个空间层和三个时间层的屏幕共享（`full SVC`）
```js
scalabilityMode: 'L3T3'
```

#### libwebrtc
`VP9 SVC` 也可以通过 `Chrome` 和基于 `libwebrtc` 的本机应用程序启用，该标志的值决定了空间和时间层的数量：
```js
WebRTC-SupportVP9SVC/EnabledByFlag_3SL3TL/
```

要在 `Chrome` 中启用 `VP9 SVC`，必须使用以下命令行参数启动浏览器：
```js
--force-fieldtrials=WebRTC-SupportVP9SVC/EnabledByFlag_3SL3TL/
```

要使用 `libwebrtc C++ API` 启用 `VP9 SVC`:
```js
webrtc::field_trial::InitFieldTrialsFromString("WebRTC-SupportVP9SVC/EnabledByFlag_3SL3TL/");
```

**注意**: 其他变体（例如 `EnabledByFlag_2SL1TL` 等）是有效的，用于替代 `EnabledByFlag_3SL3TL`。这里的问题是，`producer` 中的 `scalabilityMode` 值必须与标志中的空间层和时间层的数量匹配。

### 更新时间: 2019-12-21 14:54:50