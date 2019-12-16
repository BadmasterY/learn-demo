## mediasoup.observer

一个事件发射器，它允许应用程序（或第三方库）监视由应用程序创建的 `Worker` 实例。请参阅下面的 '`Observer Events`' 部分。

> @type [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter) readonly

### 1. Observer API
`mediasoup中` 的大多数实体都公开了一个 `observer` 属性( `Node.js` [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter))，第三方库可以使用该属性来监视与 `mediasoup` 相关的所有内容。

`Observer API` 不应直接由应用程序本身使用，而应由应用程序集成到其代码中的单独模块或库使用。这样的模块或库可以例如监视工作程序，路由器，传输等的所有创建和关闭。它还可以监视生产者和消费者产生的事件( "`pause`"，"`resume`"，"`score`"，"`layerschange`"等 )。

用法示例：

```js
const mediasoup = require("mediasoup");

mediasoup.observer.on("newworker", (worker) =>
{
  console.log("new worker created [worke.pid:%d]", worker.pid);

  worker.observer.on("close", () => 
  {
    console.log("worker closed [worker.pid:%d]", worker.pid);
  });

  worker.observer.on("newrouter", (router) =>
  {
    console.log(
      "new router created [worker.pid:%d, router.id:%s]",
      worker.pid, router.id);

    router.observer.on("close", () => 
    {
      console.log("router closed [router.id:%s]", router.id);
    });

    router.observer.on("newtransport", (transport) =>
    {
      console.log(
        "new transport created [worker.pid:%d, router.id:%s, transport.id:%s]",
        worker.pid, router.id, transport.id);

      transport.observer.on("close", () => 
      {
        console.log("transport closed [transport.id:%s]", transport.id);
      });

      transport.observer.on("newproducer", (producer) =>
      {
        console.log(
          "new producer created [worker.pid:%d, router.id:%s, transport.id:%s, producer.id:%s]",
          worker.pid, router.id, transport.id, producer.id);

        producer.observer.on("close", () => 
        {
          console.log("producer closed [producer.id:%s]", producer.id);
        });
      });

      transport.observer.on("newconsumer", (consumer) =>
      {
        console.log(
          "new consumer created [worker.pid:%d, router.id:%s, transport.id:%s, consumer.id:%s]",
          worker.pid, router.id, transport.id, consumer.id);

        consumer.observer.on("close", () => 
        {
          console.log("consumer closed [consumer.id:%s]", consumer.id);
        });
      });

      transport.observer.on("newdataproducer", (dataProducer) =>
      {
        console.log(
          "new data producer created [worker.pid:%d, router.id:%s, transport.id:%s, dataProducer.id:%s]",
          worker.pid, router.id, transport.id, dataProducer.id);

        dataProducer.observer.on("close", () => 
        {
          console.log("data producer closed [dataProducer.id:%s]", dataProducer.id);
        });
      });

      transport.observer.on("newdataconsumer", (dataConsumer) =>
      {
        console.log(
          "new data consumer created [worker.pid:%d, router.id:%s, transport.id:%s, dataConsumer.id:%s]",
          worker.pid, router.id, transport.id, dataConsumer.id);

        dataConsumer.observer.on("close", () => 
        {
          console.log("data consumer closed [dataConsumer.id:%s]", dataConsumer.id);
        });
      });
    });
  });
});
```

### 2. Observer Events

#### mediasoup.observer.on('newworker', fn(worker))

创建新 `worker` 时触发。

参数 | 类型 | 描述 
-- | -- | -- 
worker | Worker | new worker。

```js
mediasoup.observer.on("newworker", (worker) =>
{
  console.log("new worker created [pid:%d]", worker.pid);
});
```

### 更新时间: 2019-12-16 15:32:08