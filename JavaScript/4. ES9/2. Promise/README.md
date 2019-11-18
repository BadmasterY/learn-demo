# Promise

## 1. Promise.prototype.finally()
`Promise.prototype.finally` 方法在 `promise` 结束时，无论结果是 `fulfilled` 或者 `rejected`，都会执行指定的回调函数。这为在 `Promise` 是否成功完成后都需要执行的代码提供了一种方式。有效避免同样的语句需要在 `then()` 和 `catch()` 中都写一次的情况。

`finally()` 虽然与 `.then(onFinally, onFinally)` 类似，但是不同:
- 调用内联函数时，不需要多次声明该函数或为该函数创建一个变量保存。
- 由于无法知道 `promise` 的最终状态，所以 `finally` 的回调函数中不接收任何参数，仅用于无论最终结果如何都要执行的情况。
- 与 `Promise.resolve(2).then(() => {}, () => {})`(`resolved` 结果为 `undefined`)不同，`Promise.resolve(3).finally(() => {})` `resolved` 结果为 3。
- 同理，`Promise.reject(2).then(() => {}, () => {})`(`rejected` 的结果为 `undefined`)，`Promise.reject(3).finally(() => {})` `rejected` 的结果为 3。

#### 语法:
```js
promise.finally(onFinally);
```

#### 参数:
`onFinally`: 
`Promise` 结束后调用的 `funtion`。

#### 返回值:
返回一个 `Promise`，这个 `Promise` 设置了 `finally` 回调函数。

#### 例子:
```js
let isLoading = true;

fetch(requset).then(response => {
  let contentType = response.headers.get('content-type');
  if(contentType && contentType.includes('application/json')) {
    return response.json();
  }
  throw new Error('哎呀,未能捕获 json');
})
.then(json => {/*一些代码*/})
.catch(err => {/*一些代码*/})
.finally(() => isLoading = false);
```