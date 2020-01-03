## Promise
### Promise.allSettled()
`Promise.allSettled()` 方法返回一个在所有给定的 `promise` 已被决议或被拒绝后的 `promise`，并带有一个对象数组，每个对象表示对应的 `promise` 结果。

实际用法与 `Promise.all` 类似，但不会因为其中但某一个 `promise` 失败而失败。

#### 语法:
```js
Promise.allSettled(iterable);
```

#### 参数:
`iterable`: 
一个可迭代的对象，例如 `Array`，其中每个成员都是 `Promise`。

#### 返回值:
一个未决议的 `Promise` 将被异步完成一次 `promise` 的指定集合在每一个 `promise` 已经完成，无论是成功的达成或通过被拒绝。那时，返回的 `promise` 的处理程序作为输入传递一个数组，该数组包含原始 `promises` 集中每个 `promise` 的结果。

对于每个结果对象，都有一个 `status` 字符串。如果状态为 `fulfilled`，则存在一个 `value` 。如果状态为 `rejected`，则说明原因 。值（或原因）反映了每个 `promise` 决议（或拒绝）的值。

#### 例子:
```js
const promise1 = Promise.resolve(3);
const promise2 = new Promise((resolve, reject) => setTimeout(reject, 100, 'foo'));
const promises = [promise1, promise2];

Promise.allSettled(promises).
  then((results) => results.forEach((result) => console.log(result.status)));

// expected output:
// "fulfilled"
// "rejected"

// 难一些的例子
function reflect(promise) {
  return promise.then(
    (v) => {
      return { status: 'fulfilled', value: v };
    },
    (error) => {
      return { status: 'rejected', reason: error };
    }
  );
}

const promises = [ fetch('index.html'), fetch('https://does-not-exist/') ];
const results = await Promise.all(promises.map(reflect));
const successfulPromises = results.filter(p => p.status === 'fulfilled');
```