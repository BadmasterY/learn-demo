## mediasoup.createWorker(settings)

使用给定的 `settings` 创建一个新的工作程序。

参数 | 类型 | 描述 | 必需 | 默认值
-- | -- | -- | -- | --
settings | WorkerSettings | Worker settings. | No | -	 

> @async
> 
> @returns Worker

```js
const worker = async mediasoup.createWorker(
  {
    logLevel            : "warn",
    dtlsCertificateFile : "/home/foo/dtls-cert.pem",
    dtlsPrivateKeyFile  : "/home/foo/dtls-key.pem"
  });

```

### 1. Worker
一个 `worker` 代表一个在单个 `CPU` 内核中运行并处理 `Router` 实例的 `mediasoup C++` 子进程。

#### 1). WorkerSettings

Field | Type | Description | Required | Default
-- | -- | -- | -- | --
logLevel | String | 媒体工作程序子进程生成的日志的日志记录级别（请参阅调试文档）。有效值为 "`debug`"，"`warn`"，"`error`" 和 "`none`"。 | No | "`error`"
logTags | Array<String> | 记录标签以进行调试。检查调试文档中的可用标签列表。| No | []
rtcMinPort | Number | ICE，DTLS，RTP等的最小RTC端口 | No | 10000
rtcMaxPort | Number | ICE，DTLS，RTP等的最大RTC端口 | No | 59999
dtlsCertificateFile | String | PEM格式的DTLS公共证书文件的路径。如果未设置，将动态创建证书。 | No | -
dtlsPrivateKeyFile | String | PEM格式的DTLS证书私钥文件的路径。如果未设置，将动态创建证书。 | No | -
appData | Object | 自定义应用程序数据。 | No | {}

`RTC` 侦听 `IP` 未在 `worker level` 设置。相反，它们是按单个传输设置的。

#### 2). WorkerUpdateableSettings
Field | Type | Description | Required | Default
-- | -- | -- | -- | --
logLevel | String | 媒体工作程序子进程生成的日志的日志记录级别（请参阅调试文档）。有效值为 "`debug`"，"`warn`"，"`error`" 和 "`none`"。 | No | "`error`"
logTags | Array<String> | 记录标签以进行调试。检查调试文档中的可用标签列表。| No | []

#### 3). WorkerResourceUsage
具有 [uv_rusage_t](http://docs.libuv.org/en/v1.x/misc.html#c.uv_rusage_t) 结构的字段的对象。

**注**: `ru_utime` 和 `ru_stime` 这两个值以毫秒为单位。

### 2. Enums 枚举类型

#### WorkerLogLevel
Value | Description
-- | --
'debug' | 记录所有。
'warn' | 记录 "`warn`" 和 "`error`"。
'error' | 记录 "`error`"。
'none' | 不记录任何内容。

### 3. 属性
`worker` 实例的属性。
#### 1). worker.pid
工作进程的 `PID`。

> @type Number, readonly

```js
console.log(worker.pid);
// => 86665
```

#### 2). worker.closed
`worker` 是否关闭。

> @type Boolean, readonly

```js
console.log(worker.closed);
// => false
```

#### 3). worker.appData
自定义数据应用程序在 `worker` 工厂方法中提供的对象。该应用可以随时修改其内容。

> @type Object, readonly

#### 4). worker.observer
详情查看下方 `Observer Events`。

> @type [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter), readonly

### 4. 方法

#### 1). worker.close()
关闭 `worker`。在其所有路由器中触发 `workerclose` 事件(详细信息查看 `router`)。

#### 2). worker.getResourceUsage()
提供 `mediasoup-worder` 子流程的资源使用情况。

> @async
> 
> @returns WorkerResourceUsage

```js
const usage = await worker.getResourceUsage();

// =>
{
  ru_idrss: 0,
  ru_inblock: 0,
  ru_isrss: 0,
  ru_ixrss: 0,
  ru_majflt: 0,
  ru_maxrss: 46047232,
  ru_minflt: 11446,
  ru_msgrcv: 23641,
  ru_msgsnd: 40005,
  ru_nivcsw: 27926,
  ru_nsignals: 0,
  ru_nswap: 0,
  ru_nvcsw: 0,
  ru_oublock: 0,
  ru_stime: 1026,
  ru_utime: 3066
}
```

#### 3). worker.updateSettings(settings)
在运行时更新 worker 设置，只能更新一部分设置。

Argument | Type | Description | Required | Default
--|--|--|--|--
settings | WorkerUpdateableSettings | Worker updateable settings. | No | -

> @async

```js
await worker.updateSettings({ logLevel: "warn" });
```

#### 4). worker,createRouter(options)
创建一个新的 `router`。

Argument | Type | Description | Reuired | Default
--|--|--|--|--
options | RouterOptions | Router options. | Yes | -

> @async
> 
> @returns Router

```js
const mediaCodecs =
[
  {
    kind        : "audio",
    mimeType    : "audio/opus",
    clockRate   : 48000,
    channels    : 2
  },
  {
    kind       : "video",
    mimeType   : "video/H264",
    clockRate  : 90000,
    parameters :
    {
      "packetization-mode"      : 1,
      "profile-level-id"        : "42e01f",
      "level-asymmetry-allowed" : 1
    }
  }
];

const router = await worker.createRouter({ mediaCodecs });
```

### 5. 事件

#### worker.on('died', fn(error))
当 worker 进程意外结束时触发。

Argument | Type | Description
--|--|--
error | Error | Originating error.

**注**: 这种情况不应该发生（如果发生了，那就是一个 `bug`）。

```js
worker.on("died", (error) =>
{
  console.error("mediasoup worker died!: %o", error);
});
```

### 6. Observer Events
#### 1). worker.observer.on('close', fn())
`worker` 因任何原因关闭时触发。

#### 2). worker.observer.on('newrouter', fn(router))
当新的 `router` 被创建时触发。

Argument | Type | Description
-- | -- | --
router | Router | New router.

```js
worker.observer.on("newrouter", (router) =>
{
  console.log("new router created [id:%s]", router.id);
});
```

### 更新时间: 2019-12-16 15:49:51