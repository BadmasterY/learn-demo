# async iteration
这是一个非常有用的特性。 基本上它允许轻松创建异步代码循环！

此特性添加了一个新的 `for-await-of` 循环，允许在循环中调用返回 `promises`（或带有一堆 `promise` 的 `Arrays` ）的异步函数。 循环会等待每个 `Promise` 在进行下一个循环之前 `resolve`。

```js
let promises = [
  new Promise(resolve => resolve(1)),
  new Promise(resolve => resolve(2)),
  new Promise(resolve => resolve(3)),
];

async function AsyncIterat() {
  for await (let obj of promises) {
    console.log(obj);
  }
}
// => 1
// => 2
// => 3
// => Promise {<resolved>: undefined}
```