## RtpObserver
> @ abstract

`RtpObserver` 检查一组选定的 `producer` 收到的媒体。
`mediasoup` 实现以下 `RtpObserver` 类型:
- `AudioLevelObserver`

### 1. 属性
这些是所有 `RtpObserver` 类共有的属性。每个 `RtpObserver` 类可以定义新的。

#### 1). rtpObserver.id
`RtpObserver` 标识符。
> @type String, readonly

#### 2). rtpObserver.closed
`RtpObserver` 是否关闭。
> @type Boolean, readonly

#### 3). rtpObserver.paused
`RtpObserver` 是否已暂停。
> @type Boolean, readonly

#### 4). rtpObserver.appData
由应用程序在 `rtpObserver` 工厂方法中提供的自定义数据对象。应用程序可以随时修改其内容。
> @type Object, readonly

#### 5). rtpObserver.observer
请参阅下面的 `Observer Events` 部分。
> @type [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter), readonly

### 2. 方法
这些是所有 `RtpObserver` 类共有的方法。每个 `RtpObserver` 类可以定义新的。

#### 1). rtpObserver.close()
关闭 `rtpObserver`。

#### 2). rtpObserver.pause()
暂停 `rtpObserver`。在调用 `resume()` 之前不会监测 `RTP`。
> @ async

#### 3). rtpObserver.resume()
恢复 `rtpObserver`，再次监测。

#### 4). rtpObserver.addProducer(producer)
向 `rtpObserver` 提供新的 `producer` 进行监视。

Argument | Type | Description | Required | Default
--|--|--|--|--
producer | Producer | producer。 | Yes | -

> @ async

#### 5). rtpObserver.removeProducer(producer)
从 `rtpObserver` 中移除给定的 `producer`

Argument | Type | Description | Required | Default
--|--|--|--|--
producer | Producer | producer。 | Yes | -

> @ async

### 3. 事件 Events
这些是所有 `RtpObserver` 类共有的事件。每个 `RtpObserver` 类可以定义新的。

#### rtpObserver.on('routerclose', fn())
由于任何原因关闭当前所属的 `router` 时触发。`rtpObserver` 本身也将关闭。

```js
rtpObserver.on("routerclose", () =>
{
  console.log("router closed so RTP observer closed");
});
```

### 4. Observer Events
这些是所有 `RtpObserver` 类共有的`Observer Events`。每个 `RtpObserver` 类可以定义新的。

#### 1). rtpObserver.observer.on('close', fn())
由于任何原因导致 `rtpObserver` 关闭时触发。

#### 2). rtpObserver.observer.on('pause', fn())
在 `rtpObserver` 暂停时触发。

#### 3). rtpObserver.observer.on('resume', fn())
恢复 `rtpObserver` 时触发。

#### 4). rtpObserver.observer.on('addproducer', fn(producer))
在将新的 `producer` 添加到 `rtpObserver` 时触发。

Argument | Type | Description
--|--|--
producer | Producer | 新的 `producer`。

#### 5). rtpObserver.observer.on('removeproducer', fn(producer))
当从 `rtpObserver` 中移除 `producer` 时触发。

Argument | Type | Description
--|--|--
producer | Producer | 新的 `producer`。

### 更新时间: 2019-12-20 14:31:57