## Router

`router` 允许通过在其上创建的传输实例注入、选择和转发媒体流。 

```js
const router = await worker.createRouter({ mediaCodecs });
```

**注**: 开发人员可能会将 `mediasoup` 路由器视为一个 "多方会议室"，尽管 `mediasoup` 的级别远低于此，并且不局限于特定的高层用例 (例如，"多方会议室" 可能涉及各种 `mediasoup` 路由器，甚至在不同的物理主机中)。

### 1. 词典

#### 1). RouterOptions

Field | Type | Description | Required | Default
-- | -- | -- | -- | --
mediaCodes | Array<RtpCodeCapability> | 路由器媒体编解码器. | No | []
appData | Object | 自定义应用程序数据. | No | {}

- 诸如 `RTX` 之类的功能编解码器绝不能放入 `mediaCodecs` 列表中。
- 如果 `preferredPayloadType` 使用 `RtpCodecCapability`（尽管没有必要）给出，则极力建议使用 **96-127** 之间的值。

#### 2). PipeToRouterOptions

Field | Type | Description | Required | Default
-- | -- | -- | -- | --
router | Router | 目标路由器以管道传送给定的生产者。 | Yes | -
mediaCodecs | Array<RtpCodecCapability> | 路由器媒体编解码器。 | No | []
producerId | String | 生产者编号 | No | -
dataProducerId | String | 数据生产者编号 | No | -
listenIp | String | 用于在同一主机中连接两个路由器的IP。 | No | '127.0.0.1'
enableSctp | Boolean | 创建一个SCTP关联。 | No | true
numSctpStreams | NumSctpStreams | SCTP流。 | No | -

**注**:
- 只能提供 `producerId` 和 `dataProducerId` 参数的其中一个。
- `SCTP` 参数仅在首次创建基础传输时才适用。

#### 3). PipeToRouterResult

Field | Type | Description | Required | Default
-- | -- | -- | -- | --
pipeConsumer | Consumer | 在当前路由中创建的 `consumer`。 | No | -
pipeProducer | Producer | 在当前路由中创建的 `producer`。 | No | -
pipeDataConsumer | DataConsumer | 在当前路由中创建的 `data consumer`。 | No | -
pipeDataProducer | DataProducer | 在当前路由中创建的 `data producer`。 | No | -

### 2. 属性

#### 1). router.id

路由器 `id`。

> @type String, readonly

```js
console.log(router.id);
// => "15177e19-5665-4eba-9a6a-c6cf3db16259"
```

#### 2). router.closed

路由器是否关闭。

> @type Boolean, readonly

#### 3). router.rtpCapabilities

具有路由器 `RTP` 功能的对象。`mediasoup` 客户端非常需要这些功能来计算它们的发送 `RTP` 参数。

> @type RtpCapabilities, readonly

- 有关更多详细内容，请查看 `RTP参数和功能` 部分。
- 另请参阅在将它们用于客户端之前，如何 `过滤这些RTP功能`。

#### 4). router.appData

定制数据由路由器工厂方法中的应用程序提供的对象。该应用可以随时修改其内容。

> @type Object, readonly

#### 5). router.observer

详情参阅下方 `Observer Events` 部分。

> @type EventEmitter, readonly

### 3. 方法

#### 1). router.close()

关闭路由器。在所有传输中触发 `routerclose` 事件，在所有 `RTP` 观察器中触发 `routerclose` 事件。

#### 2). router.createWebRtcTransport(options)
创建一个新的 `WebRTC` 传输。

Argument | Type | Description | Required | Default
--|--|--|--|--
options | WebRtcTransportOptions | WebRTC传输选项。 | Yes | -

> @async
> 
> @returns WebRTC transport

```js
const transport = await router.createWebRtcTransport(
  {
    listenIps : [ { ip: "192.168.0.111", announcedIp: "88.12.10.41" } ],
    enableUdp : true,
    enableTcp : true,
    preferUdp : true
  });
```

#### 3). router.createPlainRtpTransport(options)

创建一个新的普通 `RTP` 传输。

Argument | Type | Description | Required | Default
--|--|--|--|--
options | PlainRtpTransportOptions | 普通RTP传输选项。 | Yes | -

> @async
> 
> @returns PlainRtpTransport

```js
const transport = await router.createPlainRtpTransport(
  {
    listenIp : "a1:22:aA::08",
    rtcpMux  : true,
    comedia  : true
  });
```

#### 4). router.createPipeTransport(options)

创建一个新的传输管道。

Argument | Type | Description | Required | Default
--|--|--|--|--
options | PipeTransportOptions | 传输管道配置。 | Yes | -

> @async
> 
> @returns PipeTransport

```js
const transport = await router.createPipeTransport(
  {
    listenIp : "192.168.1.33"
  });
```

#### 5). router.pipeToRouter(options)
将给定的媒体或数据生产者通过管道传送到同一主机中的另一个路由器。它创建了一个基础的 `PipeTransport`（如果之前未创建），它将两个路由器互连。

通过互连运行在不同工作进程（因此在不同 `CPU` 内核中）的不同路由器，这对于扩展广播功能（一对多）特别有用。

Argument | Type | Description | Required | Default
--|--|--|--|--
options | PipeToRouterOptions | 配置。 | Yes | -

> @async
> 
> @returns PipeToRouterResult

```js
// Have two workers.
const worker1 = await mediasoup.createWorker();
const worker2 = await mediasoup.createWorker();

// Create a router in each worker.
const router1 = await worker1.createRouter({ mediaCodecs });
const router2 = await worker2.createRouter({ mediaCodecs });

// Produce in router1.
const transport1 = await router1.createWebRtcTransport({ ... });
const producer1 = await transport1.produce({ ... });

// Pipe producer1 into router2.
await router1.pipeToRouter({ producerId: producer1.id, router: router2 });

// Consume producer1 from router2.
const transport2 = await router2.createWebRtcTransport({ ... });
const consumer2 = await transport2.consume({ producerId: producer1.id, ... });
```

#### 6). router.createAudioLevelObserver(options)

创建一个新的 `audio level` 观察器。

Argument | Type | Description | Required | Default
--|--|--|--|--
options | AudioLevelObserverOptions | 配置。 | Yes | - 

> @async
> 
> @returns AudioLevelObserver

```js
const audioLevelObserver = await router.createAudioLevelObserver(
  {
    maxEntries : 1,
    threshold  : -70,
    interval   : 2000
  });
```

#### 7). router.canConsume({producerId, rtpCapabilities})

给定的 `RTP` 功能是否有效以使用给定的生产者。

Argument | Type | Description | Required | Default
--|--|--|--|--
producerId | String | 生产者 ID。 | Yes | - 
rtpCapabilities | RtpCapabilities | 潜在消费者的 RTP 功能 | Yes | -

> @returns Boolean

```js
if (router.canConsume({ producerId, rtpCapabilities }))
{
  // Consume the producer by calling transport.consume({ producerId, rtpCapabilities }).
}
```

### 4. Events

#### router.on('workerclose', fn())

当此路由器所属的 `worker` 进程因任何原因关闭时发出。路由器本身也已关闭。在所有传输中触发 `routerclose` 事件，在所有 `RTP` 观察器中触发 `routerclose` 事件。

```js
router.on("workerclose", () =>
{
  console.log("worker closed so router closed");
});
```

### 5. Observer Events

#### 1). router.observer.on('close', fn())

当路由器因任何原因关闭时触发。

#### 2). router.observer.on('newtransport', fn(transport))

创建新的 `transport` 时触发。

Arugument | Type | Description
--|--|--
transport | Transport | New transport.

```js
router.observer.on("newtransport", (transport) =>
{
  console.log("new transport created [id:%s]", transport.id);
});
```

#### 3). router.observer.on('newrtpobserver', fn(rtpObserver))

创建新的 `rtp observer` 时触发。

Arugument | Type | Description
--|--|--
rtpObserver | RtpObserver | New RTP observer.

```js
router.observer.on("newrtpobserver", (rtpObserver) =>
{
  console.log("new RTP observer created [id:%s]", rtpObserver.id);
});
```

### 更新时间: 2019-12-16 16:48:04