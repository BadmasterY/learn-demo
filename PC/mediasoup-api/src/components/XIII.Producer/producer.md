## Producer
`Producer` 表示被注入 `mediashoup` 的 `Router` 的音频或视频源。它是在定义如何传输媒体数据包的传输之上创建的。

### 1. 辞典
#### 1). ProducerOptions
Field | Type | Description | Required | Default
--|--|--|--|--
kind | MediaKind | 媒体种类('`audio`' 或者 '`video`')。 | Yes | -
rtpParameters | RtpSendParamenters | `RTP` 参数定义终端发送的内容。 | Yes | -
paused | Boolean | `producer` 是否必须以暂停模式启动。 | No | false
appData | Object | 自定义应用程序数据。 | No | {}

- 有关更多详细信息，请查看 `RTP参数和功能` 部分。

#### 2). ProducerScore
Field | Type | Description | Required | Default
--|--|--|--|--
ssrc | Number | `RTP` 流 `SSRC`。 | Yes | -
rid | String | `RTP` 流的 `RID` 值。 | No | -
score | Number | `RTP` 流得分（从 `0` 到 `10`）代表传输质量。 | Yes | -

#### 3). ProducerVideoOrientation
如[WebRTC视频处理和编解码器要求中所述](https://tools.ietf.org/html/rfc7742#section-4)。

Field | Type | Description | Required | Default
--|--|--|--|--
camera | Boolean | 来源是否是摄像机。 | Yes | -
flip | Boolean | 视频源是否翻转。 | Yes | -
rotation | Number | 旋转角度（0、90、180 或者 270）。 | Yes | -

#### 4). ProducerTraceEventData
Field | Type | Description | Required | Default
--|--|--|--|--
type | ProducerTraceEventType | 追踪事件类型。 | Yes | -
timestamp | Number | 事件时间戳记。 | Yes | -
direction | String | '`in`' 或者 '`out`'。 | Yes | -
info | Object | 每个类型的特定信息。 | Yes | -

- 另请参见 '`Debugging`' 中的 `trace event`。

### 2. 枚举类型 Eunms
#### 1). ProducerType
Value | Description
--|--
'simple' | 没有空间/时间层的情况下接收到单个 `RTP` 流。
'simulcast' | 接收两个或更多 `RTP`，每个 `RTP` 流具有一个或多个时间层。
'svc' | 接收到具有时间/空间层的单个 `RTP` 流。

#### 2). ProducerTraceEventType
Value | Description
--|--
'rtp' |  `RTP` 数据包。
'keyframe' | `RTP` 视频关键帧数据包。
'nack' | `RTCP NACK` 数据包。
'pli' | `RTCP PLI` 数据包。
'fir' | `RTCP FIR` 数据包。

### 3. 属性
#### 1). producer.id
`producer` 标识符。
> @type String, readonly

#### 2). producer.closed
`producer` 是否关闭。
> @type Boolean, readonly

#### 3). producer.kind
媒体种类（'`audio`' 或者 '`video`'）。

#### 4). producer.rtpParameters
`producer` 的 `RTP` 参数。
> @type RtpSendParamers, readonly

- 有关更多详细信息，请查看 `RTP参数和功能` 部分。

#### 5). producer.type
`producer` 类型。
> @type ProducerType, readonly

#### 6). producer.paused
`producer` 是否暂停。
> @type Boolean, readonly

#### 7). producer.score
接收到的每个 `RTP` 流分数，代表其传输质量。
> @type Array<ProducerScore>, readonly

#### 8). producer.appData
由应用程序在 `producer` 工厂方法中提供的自定义数据对象。应用程序可以随时修改其内容。
> @type Object, readonly

#### 9). producer.observer
请参阅 `Observer Events` 部分。
> @type [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter), readonly

### 4. 方法
#### 1). producer.close()
关闭 `producer`，在其所有关联的 `consumer` 中触发 `producerclose` 事件。

#### 2). producer.getStats()
返回 `producer` 当前的 `RTC` 统计信息。
> @async
> 
> @returns Array<ProducerStat>

- 有关更多详细信息，请查看 `RTC统计信息` 部分。

#### 3). producer.pause()
暂停 `producer`（不将 `RTP` 发送到其关联的 `consumer`）。在其所有关联的 `consumer` 中触发 `producerpause` 事件。
> @async

#### 4). producer.resume()
恢复 `producer`（`RTP` 再次发送到关联的 `consumer`）。在其所有关联的 `consumer` 中触发 `producerresume` 事件。
> @async

#### 5). producer.enableTraceEvent(types)
指示 `producer` 发出 `trace` 事件。用于监视目的。**请谨慎使用**。
Argument | Type | Description | Required | Default
--|--|--|--|--
types | Array<ProducerTraceEventType> | 启用的类型。 | No | Unset (so disabled)

> @async

```js
await producer.enableTraceEvent([ "rtp", "pli" ]);

producer.on("trace", (trace) =>
{
  // trace.type can be "rtp" or "pli".
});
```

### 5. 事件 Events
#### 1). producer.on('transportclose', fn())
该 `producer` 所属的 `transport` 由于任何原因而关闭时触发。同时 `producer` 本身也会关闭，一个 `producerclose` 事件会在所有相关的 `consumer` 中触发。

```js
producer.on("transportclose", () =>
{
  console.log("transport closed so producer closed");
});
```

#### 2). producer.on('score', fn(score))
当 `producer` 的 `score` 发生改变时触发。

Argument | Type | Description
--|--|--
score | Array<ProducerScore> | `RTP` 流的 `score`。

#### 3). producer.on('videoorientationchange', fn(videoOrientation))
`video orientation` 发生改变时触发。如果已经在 `producer` 的 `RTP` 参数中协商了 `urn: 3gpp: video-orientation` `RTP` 扩展，则这是可能的。

Argument | Type | Description
--|--|--
videoOrientation | ProducerVideoOrientation | 新的 `videoOrientation`。

#### 4). producer.on('trace', fn(trace))
请参见 `producer.enableTraceEvent(types)` 方法。

Argument | Type | Description
--|--|--
trace | ProducerTraceEventData | `trace` 数据。

```js
producer.on("trace", (trace) =>
{
  console.log(trace);
});
```

### 6. Observer Events
#### 1). producer.observer.on('close', fn())
当 `producer` 由于任何原因而关闭时触发。

#### 2). producer.observer.on('pause', fn())
`producer` 暂停时触发。

#### 3). producer.observer.on('resume', fn())
`producer` 恢复时触发。

#### 4). producer.observer.on('score', fn(score))
与 `producer.on('score', fn(score))` 事件相同。

#### 5). producer.observer.on('videoorientationchange', fn(videoOrientation))
与 `producer.on('videoorientationchange', fn(videoOrientation))` 事件相同。

#### 6). producer.observer.on('trace', fn(trace))
与 `producer.on('trace', fn(trace))` 事件相同。

### 更新时间: 2019-12-19 14:19:44