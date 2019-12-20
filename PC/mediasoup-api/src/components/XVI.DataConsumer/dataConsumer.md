## DataConsumer
`DataConsumer` 表示从 `mediasoup` 的 `Router` 转发到端点的 `SCTP` 数据源。它是在定义如何传输数据消息的 `transport` 之上创建的。

### 1. 辞典
#### DataConsumerOptions
Field | Type | Description | Required | Default
--|--|--|--|--
dataProducerId | String | 要使用的 `dataProducer` 的 `ID`。 | Yes | -
appData | Object | 自定义应用程序数据。 | No | {}

### 2. 属性
#### 1). dataConsumer.id
`dataConsumer` 标识符。
> @type String, readonly

#### 2). dataConsumer.dataProducerId
关联的 `dataProducer` 标识符。
> @type String, readonly

#### 3). dataConsumer.closed
`dataConsumer` 是否关闭。 
> @type Boolean, readonly

#### 4). dataConsumer.sctpStreamParameters
`SCTP` 流参数。
> @type SctpStreamParameters, readonly

#### 5). dataConsumer.label
`dataConsumer` 标签。
> @type String, readonly

#### 6). dataConsumer.protocol
`dataConsumer` 子协议。
> @type String, readonly

#### 7). dataConsumer.appData
由应用程序在 `dataConsumer` 工厂方法中提供的自定义数据对象。应用程序可以随时修改其内容。
> @type Object, readonly

#### 8). dataConsumer.observer
请参阅下面的 `Observer Events` 部分。
> @type [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter), readonly

### 3. 方法
#### 1). dataConsumer.close()
关闭 `dataConsumer`。

#### 2). dataConsumer.getStats()
返回 `dataConsumer` 的当前 `SCTP` 统计信息。

> @async
> 
> @returns Array<DataProducerStat>

- 有关更多详细信息，请查看 `SCTP统计信息` 部分。

### 4. 事件 Events
#### 1). dataConsumer.on('transportclose', fn())
由于任何原因导致当前 `transport` 关闭时触发，`dataConsumer` 也将处于关闭状态。

```js
dataConsumer.on("transportclose", () =>
{
  console.log("transport closed so dataConsumer closed");
});
```

#### 2). dataConsumer.on('dataproducerclose', fn())
由于任何原因导致相关联的 `dataProducer` 关闭时触发，`dataConsumer` 本身也将关闭。

```js
dataConsumer.on("dataproducerclose", () =>
{
  console.log("associated data producer closed so dataConsumer closed");
});
```

### 5. Observer Events
#### dataConsumer.observer.on('close', fn())
由于任何原因导致 `dataConsumer` 关闭时触发。

### 更新时间: 2019-12-20 13:56:06