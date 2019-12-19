## Transport

`transport` 将端点( `endpoint` )与 `mediasoup router` 连接起来，并通过在其上创建的 `Producer` 和 `Consumer` 实例实现媒体的双向传输。

`mediasoup` 实现了以下传输类：
- WebRtcTransport
- PlainRtpTransport
- PipeTransport

### 1. 辞典
#### 1). TransportListenIp

Field | Type | Description | Required | Default
--|--|--|--|--
ip | String | 需要监听的 `IP`，IPv4 或者 IPv6 | Yes | -
announcedIp | String | 声明的 IPv4 或 IPv6（在具有专用 `IP` 的 `NAT` 后面运行 mediasoup 时有用） | No | -

#### 2). TransportTuple

Field | Type | Description | Required | Default
--|--|--|--|--
localIp | String | 本地 IP 地址。 | Yes | -
localPort | Number | 本地端口号。 | Yes | -
protocol | String | 协议( `udp` / `tcp` ) | Yes | -
remoteIp | String | 远程 IP 地址。 | No | -
remotePort | Number | 远程端口号。 | No | -

**注**: 直到远程端点的媒体地址是已知的之前，`remoteIp` 和 `remotePort` 都是未设置的。这是在调用 `PlainRtpTransport` 和 `PipeTransport` 中的 `transport.connect()` 之后发生的。或通过动态检测，因为它在发生 `WebRtcTransport`（其中远程媒体的地址是由 `ICE` 装置检测），或者 `PlainRtpTransport` (当使用 `comedia` 模式)。

#### 3). TransportTraceEventData

Field | Type | Description | Required | Default
--|--|--|--|--
type | TransportTraceEventType | 跟踪事件类型。 | Yes | -
timestamp | Number | 事件事件戳记。 | Yes | -
direction | String | '`in`' (输入方向) 或者 '`out`' (输出方向)。 | Yes | -
info | Object | 根据特定类型的信息。 | Yes | -

- 另请参阅 `Debugging` 部分的 `trace` 事件。

### 2. 枚举类型 Enums
#### 1). TransportTraceEventType
Value | Description
--|--
'probation' | RTP 试用包。
'bwe' | 传输带宽估计已更改。

#### 2). TransportSctpState

Value | Description
--|--
'new' | SCTP 程序尚未启动
'connecting' | SCTP 正在连接
'connected' | SCTP 已成功连接
'failed' | SCTP 连接失败
'closed' | STCP 传输已关闭

### 3. 属性

#### 1). transport.id
`transport` 标识符。

> @type String, readonly

#### 2). transport.closed
`transport` 是否关闭。

> @type Boolean, readonly

#### 3). transport.appData
定制数据由路由器工厂方法中的应用程序提供的对象。该应用可以随时修改其内容。

> @type Object, readonly

```js
transport.appData.foo = 'bar';
```

#### 4). transport.observer
请参阅下面的 `Observer Events` 部分。

> @type EventEmitter, readonly

### 4. 方法
这些是所有 `transport` 类通用的方法。每个 `transport` 类都可以定义新的 `transport` 类。

#### 1). transport.close()
关闭 `transport`。在所有生产者中触发 `transportclose` 事件，在所有消费者中触发 `transportclose` 事件。

#### 2). transport.getStats()

返回 `transport` 的当前 `RTC` 统计信息。每个 `transport` 类别产生一组不同的统计信息。

> @async
> 
> @abstract
> 
> @returns Array<Object>

- 有关更多详细信息，请查看 `RTC统计信息` 部分。

#### 3). transport.connect()

为 `transport` 提供远程端点的传输参数。每个 `transport` 类在此方法中都需要特定的参数。检查下方每个 `transport` 类的 `connect()` 方法。

> @async
> 
> @abstract

#### 4). transport.setMaxIncomingBitrate(bitrate)

设置远程端点通过此 `transport` 发送的媒体流的最大传入比特率。

Argument | Type | Description | Required | Default
--|--|--|--|--
bitrate | Number | 允许发送的最大比特率 bps。 | Yes | 0(无限制)

> @async

**注意**: 仅当远程发件人提供 `REMB` 时才可以使用此方法，通常 `WebRTC` 仅支持该功能。

```js
await transport.setMaxIncomingBitrate(3500000);
```

#### 5). transport.produce(options)

指示 `transport` 接受音频或视频 `RTP` (或 `SRTP`，具体取决于传输类别)。这是将媒体注入 `mediasoup` 的方法。

Argument | Type | Description | Required | Default
--|--|--|--|--
options | ProducerOptions | 生产者配置。 | Yes | -

> @async
> 
> @returns Producer

- 有关更多详细信息，请查看 `RTP参数和功能` 部分。

```js
const producer = await transport.produce(
  {
    kind          : "video",
    rtpParameters :
    {
      mid    : "1",
      codecs :
      [
        {
          mimeType    : "video/VP8",
          payloadType : 101,
          clockRate   : 90000,
          rtcpFeedback :
          [
            { type: "nack" },
            { type: "nack", parameter: "pli" },
            { type: "ccm", parameter: "fir" },
            { type: "goog-remb" }
          ]
        },
        {
          mimeType    : "video/rtx",
          payloadType : 102,
          clockRate   : 90000,
          parameters  : { apt: 101 }
        }
      ],
      headerExtensions :
      [
        {
          id  : 2, 
          uri : "urn:ietf:params:rtp-hdrext:sdes:mid"
        },
        { 
          id  : 3, 
          uri : "urn:ietf:params:rtp-hdrext:sdes:rtp-stream-id"
        },
        { 
          id  : 5, 
          uri: "urn:3gpp:video-orientation" 
        },
        { 
          id  : 6, 
          uri : "http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time"
        }
      ],
      encodings :
      [
        { rid: "r0", active: true, maxBitrate: 100000 },
        { rid: "r1", active: true, maxBitrate: 300000 }
        { rid: "r2", active: true, maxBitrate: 900000 }
      ],
      rtcp :
      {
        cname : "Zjhd656aqfoo"
      }
    }
  });
```

#### 6). transport.consume(options)

指示 `transport` 发送音频或视频 `RTP` (或 `SRTP`，具体取决于传输类别)。这是从 `mediasoup` 中提取媒体的方法。

Argument | Type | Description | Required | Default
--|--|--|--|--
options | ConsumerOptions | 消费者配置。 | Yes | -

> @async
> 
> @returns Consumer

- 有关更多详细信息，请查看 `RTP参数和功能` 部分。

```js
const consumer = await transport.consume(
  {
    producerId      : "a7a955cf-fe67-4327-bd98-bbd85d7e2ba3",
    rtpCapabilities :
    {
      codecs :
      [
        {
          mimeType             : "audio/opus",
          kind                 : "audio",
          clockRate            : 48000,
          preferredPayloadType : 100,
          channels             : 2
        },
        {
          mimeType             : "video/H264",
          kind                 : "video",
          clockRate            : 90000,
          preferredPayloadType : 101,
          rtcpFeedback         :
          [
            { type: "nack" },
            { type: "nack", parameter: "pli" },
            { type: "ccm", parameter: "fir" },
            { type: "goog-remb" }
          ],
          parameters :
          {
            "level-asymmetry-allowed" : 1,
            "packetization-mode"      : 1,
            "profile-level-id"        : "4d0032"
          }
        },
        {
          mimeType             : "video/rtx",
          kind                 : "video",
          clockRate            : 90000,
          preferredPayloadType : 102,
          rtcpFeedback         : [],
          parameters           :
          {
            apt : 101
          }
        }
      ],
      headerExtensions :
      [
        {
          kind             : "video",
          uri              : "http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time", // eslint-disable-line max-len
          preferredId      : 4,
          preferredEncrypt : false
        },
        {
          kind             : "audio",
          uri              : "urn:ietf:params:rtp-hdrext:ssrc-audio-level",
          preferredId      : 8,
          preferredEncrypt : false
        },
        {
          kind             : "video",
          uri              : "urn:3gpp:video-orientation",
          preferredId      : 9,
          preferredEncrypt : false
        },
        {
          kind             : "video",
          uri              : "urn:ietf:params:rtp-hdrext:toffset",
          preferredId      : 10,
          preferredEncrypt : false
        }
      ]
    }
  });
```

#### 7). transport.produceData(options)

指示 `transport` 通过 `SCTP` 流接收数据。这是将数据注入 `mediasoup` 的方法。

Argument | Type | Description | Required | Default
--|--|--|--|--
options | DataProducerOptions | 数据生产者配置。 | No | {}

> @async
> @returns DataProducer

```js
const dataProducer = await transport.produceData();
```

#### 8). transport.consumeData(options)

指示 `transport` 通过 `SCTP` 流发送数据。这是从 `mediasoup` 中提取数据的方法。

Argument | Type | Description | Required | Default
--|--|--|--|--
options | DataConsumerOptions | 数据消费者配置。 | Yes | -

> @async
> @returns DataConsumer

```js
const dataConsumer = await transport.consumeData(
  {
    producerId : "a7a955cf-fe67-4327-bd98-bbd85d7e2ba4"
  });
```

#### 9). transport.enableTraceEvent(types)

指示 `transport` 发出 `trace` 事件。用于监视目的，**请谨慎使用**。

Argument | Type | Description | Required | Default
--|--|--|--|--
types | Array<TransportTraceEventType> | 启用的类型。 | No | Unset(已禁用)

> @async

```js
await transport.enableTraceEvent([ "probation" ]);

transport.on("trace", (trace) =>
{
  // trace.type can just be "probation".
});
```

### 5. 事件
这些是所有 `transport` 类通用的事件。每个 `transport` 类都可以定义新的 `transport` 类。

#### 1). transport.on('routerclose', fn())
当此 `transport` 所属的 `router` 进程因任何原因关闭时发出。`transport` 本身也已关闭。在所有传输中触发 `transportclose` 事件，在所有 `RTP` 观察器中触发 `transportclose` 事件。

```js
transport.on("routerclose", () =>
{
  console.log("router closed so transport closed");
});
```

#### 2). transport.on('trace', fn(trace))

详情参见 `transport.enableTraceEvent()` 方法。

Argument | Type | Description
--|--|--
trace | TransportTraceEvent | 跟踪数据。

```js
transport.on("trace", (trace) =>
{
  console.log(trace);
});
```

### 6. Observer Events
这些是所有 `transport` 类通用的 `observer` 事件。每个 `transport` 类都可以定义新的 `transport` 类。

#### 1). transport.observer.on('close', fn())
当 `transport` 由于某种原因而关闭时触发。

#### 2). transport.obersver.on('newproducer', fn(producer))

创建新的 `producer` 时触发。

Argument | Type | Description
--|--|--
producer | Producer | 新的 `producer`

```js
transport.observer.on("newproducer", (producer) =>
{
  console.log("new producer created [id:%s]", producer.id);
});
```

#### 3). transport.observer.on('newconsumer', fn(consumer))

创建新的 `consumer` 时触发。

Argument | Type | Description
--|--|--
consumer | Consumer | 新的 `consumer`。

```js
transport.observer.on("newconsumer", (consumer) =>
{
  console.log("new consumer created [id:%s]", consumer.id);
});
```

#### 4). transport.observer.on('newdataproducer', fn(dataProducer))

在创建新的 `dataProducer` 时触发。

Argument | Type | Description
--|--|--
dataProducer | DataProducer | 新的 `dataProducer`。

```js
transport.observer.on("newdataproducer", (dataProducer) =>
{
  console.log("new data producer created [id:%s]", dataProducer.id);
});
```

#### 5). transport.observer.on('newdataconsumer', fn(dataConsumer))

在创建新的 `dataConsumer` 时触发。

Argument | Type | Description
--|--|--
dataConsumer | DataConsumer | 新的 `dataConsumer`。

```js
transport.observer.on("newdataconsumer", (dataConsumer) =>
{
  console.log("new data consumer created [id:%s]", dataConsumer.id);
});
```

#### 6). transport.observer.on('trace', fn(trace))

详情参见 `transport.enableTraceEvent()` 方法。

### 更新时间: 2019-12-17 17:24:04