## Consumer
`Consumer` 表示从 `mediasoup` 的 `Router` 转发到终端的音频或视频源。它是在定义如何传输媒体数据包的 `transport` 之上创建的。

### 1. 辞典
#### 1). ConsumerOptions
Field | Type | Description | Required | Default
--|--|--|--|--
producerId | String | 要使用的 `producer` 的 `ID`。 | Yes | -
rtpCapabilities | RtpCapabilities | `consumer` 终端的 `RTP` 功能。 | Yes | -
paused | Boolean | `consumer` 是否必须以暂停模式启动。 | No | false
preferredLayers | ConsumerLayers | `simulcast` 或者 `SVC` 媒体源的首选时空层。如果未设置，则选择最高的。 | No | -
appData | Object | 自定义应用程序数据。 | No | {}

- 有关更多详细信息，请查看 `RTP参数和功能` 部分。

创建 `consumer` 时，建议将其 `paused` 设置为 `true`，然后将 `consumer` 参数传输到 `consumer` 端点，并且，一旦 `consumer` 端点创建了其本地端 `consumer`，使用 `resume()` 方法取消服务器端 `consumer` 的暂停。

在 `pasued` 模式下创建服务器端的 `consumer` 的原因:
- 如果远程终端是 `WebRTC` 浏览器或应用程序，并且在远程 `RTCPeerConnection` 准备好处理它之前它接收到新 `consumer` 的 `RTP` 数据包（这是在远程端点创建的远程 `consumer` 之前)，可能发生 `RTCPeerConnection` 错误地将接收到的数据包的 `SSRC` 关联到一个已经存在的`SDP m= section`，因此即将创建新 `consumer` 及其相关 `m= section` 将失败。
  - 相关查看这个 [issue](https://github.com/versatica/libmediasoupclient/issues/57)。
- 同样，在创建视频 `consumer` 时，这是一种优化，使 `consumer` 端点能够尽可能地渲染视频。如果服务器端 `consumer` 是使用 `paused:false` 创建的，则 `mediashoup` 将立即向生产者请求一个关键帧，并且该关键帧可能会在它准备好使用它之前到达使用端点，从而生成 "黑色"视频，直到设备自己请求一个关键帧。

#### 2). ConsumerLayers
Field | Type | Description | Required | Default
--|--|--|--|--
spatiallayer | Number | 空间层索引(从 0 到 N)。 | Yes | -
temporallayer | Number | 时间层索引(从 0 到 N)。 | No | -

#### 3). ConsumerScore
Field | Type | Description | Required | Default
--|--|--|--|--
score | Number | `consumer` 中 `RTP` 流的 `score`（从 0 到 10），代表其传输质量。 | Yes | -
producerScore | Number | 相关联的 `producer` 中当前选定的 `RTP` 流的 `score`（从 0  到 10），代表其传输质量。 | Yes | -

#### 4). ConsumerTraceEventData
Field | Type | Description | Required | Default
--|--|--|--|--
type | ConsumerTraceEventType | `trace` 事件类型。 | Yes | -
timestamp | Number |  事件事件戳记。 | Yes | -
direction | String | '`in`' 或者 '`out`' | Yes | -
info | Object | 每个类型的特定信息。 | Yes | -

- 另请参见 `Debugging` 部分中的 `trace` 事件。

### 2. 枚举类型 Enums
#### 1). ConsumerType
Value | Description
--|--
'simple' | 没有空间/时间层的情况下发送单个 `RTP` 流。
'simulcast' | 发送两个或多个 `RTP` 流，每个 `RTP` 流具有一个或多个时间层。
'svc' | 单个 `RTP` 流与空间/时间层一起发送。
'pipe' | 在 `PipeTransport` 上为 `consumer` 创建的特殊类型。

#### 2). ConsumerTraceEventType
Value | Description
--|--
'rtp' | `RTP` 数据包。
'keyframe' | `RTP` 视频关键帧数据包。
'nack' | `RTCP NACK` 数据包。
'pli' | `RTCP PLI` 数据包。
'fir' | `RTCP FIR` 数据包。

### 3. 属性
#### 1). consumer.id
`consumer` 标识符。
> @type String, readonly

#### 2). consumer.producerId
关联的 `producer` 标识符。
> @type String, readonly

#### 3). consumer.closed
`consumer` 是否关闭。

#### 4). consumer.kind
媒体种类（'`audio`' 或者 '`video`'）。

#### 5). consumer.rtpParameters
`consumer` 的 `RTP` 参数。
> @type RtpReceiveParameters, readonly

- 有关更多详细信息，请查看 `RTP参数和功能` 部分。

#### 6). consumer.type
`consumer` 类型。
> @type ConsumerType, readonly

#### 7). consumer.paused
`consumer` 是否暂停。它不考虑关联的 `producer` 是否暂停。
> @type Boolean, readonly

#### 8). consumer.producerPaused
`consumer` 相关联的 `producer` 是否暂停。
> @type Boolean, readonly

#### 9). consumer.score
发送的 `RTP` 流的 `score`，表示其传输质量。
> @type ConsumerScore, readonly

#### 10). consumer.preferredLayers
首选的时间和空间层(请参见 `setPreferredLayers()` 方法)。除 `simulcast` 和 `svc` 类型的 `consumer` ，其余均为 `null`。
> @type ConsumerLayers|Null, readonly

#### 11). consumer.currentLayers
当前活动的空间和时间层（针对 `simulcast` 和 `svc` 的 `consumer`）。此时没有任何层被发送到使用方端点，则为 `null`。
> @type ConsumerLayers|Null, readonly

#### 12). consumer.priority
`consumer` 优先级（请参见 `setPriority()` 方法）。
> @type Number, readonly

#### 13). consumer.appData
由应用程序在 `consumer` 工厂方法中提供的自定义数据对象。应用程序可以随时修改其内容。
> @type Object, readonly

#### 14). consumer.observer
请参阅下方 `Observer Events` 部分。
> @type [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter), readonly

### 4. 方法 Events
#### 1). consumer.close()
关闭 `consumer`。

#### 2). consumer.getStats()
返回 `consumer` 的当前 `RTC` 统计信息。

> @async
> 
> @returns Array<ConsumerStat>

- 有关更多详细信息，请查看 `RTC统计信息` 部分。

#### 3). consumer.pause()
暂停 `consumer`（没有 `RTP` 发送到 `consumer` 端点）。
> @async

#### 4). consumer.resume()
恢复 `consumer`（`RTP` 再次发送到 `consumer` 端点）。
> @async

#### 5). consumer.setPreferredLayers(preferredLayers)
设置要发送到 `consumer` 端点的首选(最高)空间和时间层。仅针对 `simulcast` 和 `svc` 两种 `consumer` 有效。

Argument | Type | Description | Required | Default
--|--|--|--|--
preferredLayers | ConsumerLayers | 首选的空间和时间层。时间层是可选的（如果未设置，则选择最高的层）。 | Yes | -

> @async

```js
await consumer.setPreferredLayers({ spatialLayer: 3 });
```

#### 6). consumer.setPriority(priority)
Argument | Type | Description | Required | Default
--|--|--|--|--
priority | Number | [1, 255] | Yes | -

> @async

**注意**: 仅当估计的输出比特率不足以满足所有视频 `consumer` 的需求时，`consumer` 的优先级才有意义。

```js
await consumer.setPriority(2);
```

#### 7). consumer.unsetPriority()
重置当前 `consumer` 的优先级（将其设置为 1）。

> @async

```js
await consumer.unsetPriority();
```

#### 8). consumer.requestKeyFrame()
向关联的 `producer` 请求关键帧。仅对视频 `consumer` 有效。

> @async

#### 9). consumer.enableTraceEvent(types)
指示 `consumer` 发出 `trace` 事件。用于监视的目的。**请谨慎使用**。

Argument | Type | Description | Required | Default
--|--|--|--|--
types | Array<ConsumerTraceEventType> | 启用的类型。 | No | 未设置(已禁用)

> @async

```js
await consumer.enableTraceEvent([ "rtp", "pli", "fir" ]);

consumer.on("trace", (trace) =>
{
  // trace.type can be "rtp" or "pli" or "fir".
});
```

### 5. 事件 Events
#### 1). consumer.on('transportclose', fn())
该 `consumer` 所属的 `transport` 由于任何原因而关闭时触发。`consumer` 本身也处于关闭状态。
```js
consumer.on("transportclose", () =>
{
  console.log("transport closed so consumer closed");
});
```

#### 2). consumer.on('producerclose', fn())
当关联的 `producer` 由于任何原因关闭时触发。`consumer` 本身也是关闭状态。

```js
consumer.on("producerclose", () =>
{
  console.log("associated producer closed so consumer closed");
});
```

#### 3). consumer.on('producerpause', fn())
当关联的 `producer` 暂停时触发。

#### 4). consumer.on('producerresume', fn())
当关联的 `producer` 恢复时触发。

#### 5). consumer.on('score', fn(score))
当 `consumer` 的 `score` 发生改变时触发。

Argument | Type | Description
--|--|--
score | ConsumerScore | `RTP` 流的 `score`。

#### 6).

### 更新时间: 2019-12-19 16:39:00