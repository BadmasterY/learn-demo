# Promise

## 1. Promise
`Promise` 是异步编程的一种解决方案，用于表示一个异步操作的最终完成(或失败)，及其结果。

`Promise` 对象是一个代理对象(代理一个值)，被代理的值在 `Promise` 对象创建时是未知的。

`Promise` 允许为异步操作的成功和失败分别绑定到相应的处理方法，这让异步方法可以像同步方法那样返回值，但并不是立即返回最终执行结果，而是一个能代表未来出现的结果的 `promise` 对象。

`Promise` 新建后会立即执行。

`Promise` 对象的状态不受外界影响，且一旦状态改变就不会再变。有以下几种状态:
- `pending`: 初始状态(无状态);
- `fulfilled`: 操作成功;
- `rejected`: 操作失败。

意味着 `promise` 对象可以从 `pending` 状态变成 `fulfilled` 状态，也可以从 `pending` 状态变成 `rejected` 状态。同时随着状态的改变，将触发对应的函数。但无论哪种状态(`pending` 除外)，一旦确定确定就不会再改变。

#### 语法:
```js
new Promise(function(resolve, reject){/*executor */});
```

#### 参数:
`executor`: 
`executor` 是带有 `resolve` 和 `reject` 两个参数的函数。

#### 例子:
```js
let promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve('250ms after'), 250);
});

promise.then(successMessage => console.log('no! ' + successMessage));
// wait 250ms...
// ==> 'no! 250ms after'
```

## 2. Promise.prototype.then()
`Promise.prototype.then` 方法返回一个新的 `Promise` 实例。

由于 `Promise.prototype.then` 与 `Promise.prototype.catch` 方法都会返回 `promise`，它们可以被链式调用——同时这也是一种被称为**复合**(composition)的操作。

#### 语法:
```js
promise.then(onFulfilled[, onRejected]);

promise.then(value => {
  // fulfill
}, reason => {
  // reject
});
```

#### 参数:
`onFulfilled`: 
可选，当 `promise` 状态变为 `fulfilled` 时调用的函数。该函数接收一个参数，即 `fulfilled` 的结果。

`onRejected`: 
可选，当`promise` 状态变为 `rejected` 时调用的函数。该函数接收一个参数，即 `rejected` 的结果。

#### 返回值:
当 `Promise` 状态改变时，返回函数将被异步调用(由当前的线程循环来调度完成)。具体返回值依据以下规则返回:
- 返回一个值，那么 `then` 返回的 `promise` 将会成为 `fulfilled` 状态，并且将返回值作为当前回调函数的参数值;
- 没有返回值，那么 `then` 返回的 `promise` 将会成为 `fulfilled` 状态，并且将 `undefined` 作为当前回调函数的参数值;
- 抛出一个错误，那么 `then` 返回的 `promise` 将会成为 `rejected` 状态，并且将抛出的错误作为当前回调函数的参数;
- 返回一个已经是 `fulfilled` 状态的 `promise`，那么 `then` 返回的 `promise` 也会成为接受状态，并且将那个 `fulfilled` 状态的 `promise` 的参数值，作为当前回调函数的参数值;
- 返回一个 `rejected` 状态的 `promise`，那么 `then` 返回的 `promise` 也会成为拒绝状态，并且将那个 `rejected` 状态的 `promise` 的参数值，作为当前回调函数的参数值;
- 返回一个 `pending` 状态的 `promise`，那么 `then` 返回的 `promise` 也是初始状态，并且当前 `promise` 的最终状态取决于返回的 `promise`，同时这个返回的 `promise` 的回调参数也会作为参数传入到当前回调函数。

#### 例子:
```js
let promise = new Promise((resolve, reject) => {
  resolve('success!');
});

promise.then(resolve => {
  console.log(resolve); // ==> 'success!'
}, reject => {
  console.error(reject);
});
```

## 3. Promise.prototype.catch()
`Promise.prototype.catch` 方法返回一个 `promise` 实例，并且处理 `rejected` 的情况。

#### 语法:
```js
promise.catch(onRejected);

promise.catch(reject => {...});
```

#### 参数:
`onRejected`: 
当 `promise` 的状态变更为 `rejected` 时，被调用的一个 `function`。该函数接收一个参数，即 `rejected` 的结果。

#### 返回值:
一个 `promise`。

#### 例子:
```js
let promise = new Promise((resolve, reject) => {
 resolve('success.');
});

promise.then(resolve => {
  console.log(resolve); // ==> 'success.'
  throw 'rejected! no!';
}).catch(reject => {
  console.log(reject); // ==> 'rejected! no!'
}).then(() => {
  console.log('after a catch fufilled.'); // ==> 'after a catch fufilled.'
}, () => {
  console.log('after a catch rejected.');
});
```

## 4. Promise.all()
`Promise.all` 方法用于将多个 `promise` 实例包装成一个新的 `promise` 实例。

#### 语法:
```js
Promise.all(iterable);
```

#### 参数:
`iterable`: 
一个可迭代的对象，如 `Array` 或 `String`。

#### 返回值:
返回一个 `promise`:
- 如果传入的参数是一个空的可迭代对象，则返回一个**已完成(already resolved)**状态的 `promise`;
- 如果传入的参数不包含任何 `promise`，则返回一个**异步完成(asynchronously resolved)**状态的 `promise`。注意: Chrome 58 返回的是已完成状态;
- 其他情况下返回一个 `pending` 状态的 `promise`。这个返回的 `promise` 之后会在所有的 `promise` 实例都完成或者其中一个失败时，异步的改变状态。

#### 例子:
```js
let promise_1 = Promise.resolve(18);
let promise_2 = 137;
let promise_3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'Mr.');
});

Promise.all([promise_1, promise_2, promise_3]).then(resolve => {
  console.log(resolve); // ==> [18, 137, 'Mr.']
});
```

## 5. Promise.race()
`Promise.race` 方法用于将多个 `promise` 实例包装成一个新的 `promise` 实例。

#### 语法:
```js
Promise.race(iterable);
```

#### 参数:
`iterable`: 
可迭代对象，类数组。

#### 返回值:
返回一个 `promise`，只要给定的迭代中的一个 `promise` 的状态发生改变，这个被返回的 `promise` 就采用第一个发生改变的 `promise` 的状态。

#### 例子:
```js
let promise_1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, 'Mr.');
});

let promise_2 = new Promise((resolve, reject) => {
  setTimeout(reject, 300, '18');
});

let promise_3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'China');
});

Promise.race([promise_1, promise_2, promise_3]).then(resolve => {
  console.log(resolve); // ==> 'China'
}).catch(reject => {
  console.log(reject); // 未调用
});
```

## 6. Promise.resolve()
`Promise.resolve` 方法用来将非 `promise` 对象转化为 `promise` 对象，返回一个以给定值解析后的 `promise` 对象。

**注意**:不要在解析为自身的 `thenable` 上调用 `Promise.resolve`。这将导致无限递归，因为它试图展平无限嵌套的 `promise`。

#### 语法:
```js
Promise.resolve(value);
```

#### 参数:
`value`: 
将被 `Promise` 对象解析的参数，也可以是一个 `Promise` 对象，或者一个 `thenable`。

#### 返回值:
返回一个解析过带着给定值的 `Promise` 对象，如果参数是一个 `Promise` 对象，则直接返回这个 `Promise` 对象。

#### 例子:
```js
Promise.resolve('success').then(resolve => {
  console.log(resolve); // ==> 'success'
}).catch(reject => {
  console.log(reject); // ==> 未调用
});

// 等价
new Promise((resolve, reject) => {resolve('success');});
```

## 7. Promise.reject()
`Promise.reject` 方法返回一个带有 `rejected` 原因 `reason` 参数的 `Promise` 实例。

#### 语法:
```js
Promise.reject(reason);
```

#### 参数:
`reason`: 
表示 `promise` 被拒绝的原因。

#### 返回值:
一个给定原因了的被拒绝的 `promise`。

#### 例子:
```js
Promise.reject('error: xxx')
.then(resolve => {/*未调用*/})
.catch(reject => {
  console.log(reject); // ==> 'error: xxx'
});
```