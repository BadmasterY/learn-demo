## DataProducer
`DataProducer` 表示将 `SCTP` 数据源注入到 `mediasoup` 的 `Router` 中。它是在定义如何传输数据消息的 `transport` 之上创建的。

### 1. 辞典
#### DataProducerOptions
Argument | Type | Description | Required | Default
--|--|--|--|--
sctpStreamParameters | SctpStreamParameters | `SCTP` 参数定义端点如何发送数据。 | Yes | -
label | String | 一个标签，可用于区分此 `DataChannel` 与其他 `DataChannel`。 | No | -
protocol | String | 此 `DataChannel` 使用的子协议的名称。 | No | -
appData | Object | 自定义应用程序数据。| No | {}

### 2. 属性
#### 1). dataProducer.id
`dataProducer` 的标识符。
> @type String, readonly

#### 2). dataProducer.closed
`dataProducer` 是否关闭。
> @type Boolean, readonly

#### 3). dataProducer.sctpStreamParameters
`STCP` 流参数。
> @type SctpStreamParameters, readonly

#### 4). dataProducer.label
`dataProducer` 标签。
> @type String, readonly

#### 5). dataProducer.protocol
`dataProducer` 子协议。
> @type String, readonly

#### 6). dataProducer.appData
由应用程序在 `dataProducer` 工厂方法中提供的自定义数据对象。应用程序可以随时修改其内容。
> @type Object, readonly

#### 7). dataProducer.observer
请参阅下面的 `Observer Events` 部分。
> @type [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter), readonly

### 3. 方法
#### 1). dataProducer.close()
关闭 `dataProducer`。在其所有关联的 `consumer` 中触发 `dataproducerclose` 事件。

#### 2). dataProducer.getStats()
返回 `dataProducer` 的当前 `SCTP` 统计信息。

> @async
> 
> @returns Array<DataProducerStat>

- 有关更多详细信息，请查看 `SCTP统计信息` 部分。

### 4. 事件 	Events
#### dataProducer.on('transportclose', fn())
由于任何原因关闭此 `dataProducer` 所属的 `transport` 时触发。`dataProducer` 本身也将关闭。一个 `dataproducerclose` 事件在所有相关联的 `consumer` 中触发。

```js
dataProducer.on("transportclose", () =>
{
  console.log("transport closed so dataProducer closed");
});
```

### 5. Observer Events
#### dataProducer.observer.on('close', fn())
当 `dataProducer` 由于任何原因关闭时触发。

### 更新时间: 2019-12-20 13:49:02